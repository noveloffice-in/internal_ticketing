import frappe

@frappe.whitelist()
def get_user_department(user_id: str):
    user = frappe.get_list("User", filters={"name": user_id}, fields=["department", "user_permission_type"])
    return user

@frappe.whitelist()
def get_user_icon(user_id: str):
    user_query = """
        SELECT  CONCAT(UPPER(LEFT(first_name, 1)), UPPER(LEFT(last_name, 1))) AS profile
        FROM `tabUser` 
        WHERE name = %s
        """
    
    user = frappe.db.sql(user_query, user_id, as_dict=True)
    return user

@frappe.whitelist()
def get_ticket_count_by_department(department, user_permission_type, user_id):
    if not department:
        return {"error": "Department is required"}

    ticket_status_order = ["All Tickets", "Unassigned Tickets", "Open Tickets", "Working Tickets", "Solved Tickets", "Needs Verification", "Overdue Tickets", "On-Hold Tickets", "Cancelled Tickets"];
    if user_permission_type == "TL" or user_permission_type == "POC":
        query = """
            SELECT 
                status.name as ticket_status, 
                COALESCE(COUNT(tickets.name), 0) as count
            FROM 
                `tabInternal Ticket Status` status
            LEFT JOIN 
                `tabInternal Tickets` tickets 
            ON 
                status.name = tickets.ticket_status 
            AND 
                tickets.assigned_department = %s
            GROUP BY 
                status.name
        """
        result = frappe.db.sql(query, department, as_dict=True)
    elif user_permission_type == "Member":
        query = """SELECT 
                status.name as ticket_status, 
                COALESCE(COUNT(tickets.name), 0) as count
            FROM 
                `tabInternal Ticket Status` status
            LEFT JOIN 
                `tabInternal Tickets` tickets 
            ON 
                status.name = tickets.ticket_status 
            AND 
                tickets.assigned_department = %s
            AND
                tickets.assigned_to = %s
            OR 
                tickets.visible_for_entire_team = 1
            GROUP BY 
                status.name
        """
        result = frappe.db.sql(query, [department, user_id], as_dict=True)

    result = sorted(result, key=lambda x: ticket_status_order.index(x['ticket_status']))
    all_tickets_count = sum(item['count'] for item in result)
    result.insert(0, {'ticket_status': 'All Tickets', 'count': all_tickets_count})
    return result

@frappe.whitelist()
def get_ticket_list(department, user_permission_type, user_id):
    if not department:
        return {"error": "Department is required"}
    if user_permission_type == "TL" or user_permission_type == "POC":
        query = """
            SELECT 
                tickets.name,
                tickets.subject, 
                users.full_name as assigned_to, 
                tickets.ticket_status, 
                tickets.due_date,
                tickets.creation,
                tickets.priority
            FROM 
                `tabInternal Tickets` tickets
            LEFT JOIN 
                `tabUser` users 
            ON 
                tickets.assigned_to = users.name
            WHERE 
                tickets.assigned_department = %s
            ORDER BY 
                tickets.creation DESC
            """
        result = frappe.db.sql(query, department, as_dict=True)

    elif user_permission_type == "Member":
        query = """
            SELECT 
                tickets.name,
                tickets.subject, 
                users.full_name as assigned_to, 
                tickets.ticket_status, 
                tickets.due_date,
                tickets.creation,
                tickets.priority
            FROM 
                `tabInternal Tickets` tickets
            LEFT JOIN 
                `tabUser` users 
            ON 
                tickets.assigned_to = users.name
            WHERE 
                tickets.assigned_department = %s
            AND
                tickets.assigned_to = %s
            OR 
                tickets.visible_for_entire_team = 1
            ORDER BY 
                tickets.creation DESC
            """
        result = frappe.db.sql(query, [department, user_id], as_dict=True)
    return result

@frappe.whitelist()
def create_ticket(form_data):
    assigned_department = form_data['assigned_department']
    subject = form_data['subject']
    due_date = form_data['dueDate']
    message = form_data['message']
    status = form_data['status']
    priority = form_data['priority']
    parent_ticket = form_data['parentTicket']
    location = form_data['location']
    team = form_data['team']
    assigned_to = form_data['assignedTo']

    ticket = frappe.new_doc("Internal Tickets")
    ticket.assigned_department = assigned_department
    ticket.subject = subject
    ticket.due_date = due_date
    ticket.message = message
    ticket.ticket_status = status
    ticket.priority = priority
    ticket.parent_ticket = parent_ticket
    ticket.location = location
    ticket.team = team
    ticket.assigned_to = assigned_to
    ticket.save()
    frappe.publish_realtime('ticket_creation', {'ticket_id': ticket.name})
    return {"success": "Ticket created successfully"}

@frappe.whitelist()
def get_ticket_sub_details(ticket_id):
    query = """
        SELECT assigned_to, due_date, ticket_status, priority, creation, assigned_department, owner
        FROM `tabInternal Tickets`
        WHERE name = %s
    """
    result = frappe.db.sql(query, ticket_id, as_dict=True)

    if result:
        created_by = result[0].get('owner')
        if created_by:
            user_query = """
                SELECT designation, CONCAT(UPPER(LEFT(first_name, 1)), UPPER(LEFT(last_name, 1))) AS profile, full_name
                FROM `tabUser` 
                WHERE name IN (%s, %s)
            """
            user_result = frappe.db.sql(user_query, (created_by, result[0].get('assigned_to')), as_dict=True)
            if len(user_result) == 2:
                result[0]['owner_designation'] = user_result[0].get('designation')
                result[0]['owner_full_name'] = user_result[0].get('full_name')
                result[0]['owner_profile'] = user_result[0].get('profile')
                result[0]['assigned_to_full_name'] = user_result[1].get('full_name')
                result[0]['assigned_to_profile'] = user_result[1].get('profile')
            elif len(user_result) == 1:
                result[0]['owner_designation'] = user_result[0].get('designation')
                result[0]['owner_full_name'] = user_result[0].get('full_name')
                result[0]['owner_profile'] = user_result[0].get('profile')
                result[0]['assigned_to_full_name'] = user_result[0].get('full_name')
                result[0]['assigned_to_profile'] = user_result[0].get('profile')

    return result

@frappe.whitelist()
def get_sub_ticket_info(ticket_id):
    query = """
        SELECT t.name, t.subject, t.ticket_status, t.creation, 
               t.assigned_to, u.full_name as assigned_to_name, t.due_date
        FROM `tabInternal Tickets` t
        LEFT JOIN `tabUser` u ON t.assigned_to = u.name
        WHERE t.parent_ticket = %s
    """
    result = frappe.db.sql(query, ticket_id, as_dict=True)

    return result

@frappe.whitelist()
def get_ticket_timeline(ticket_id):
    query = """
        SELECT *
        FROM `tabTicket Timline Tracker`
        WHERE parent = %s
    """
    result = frappe.db.sql(query, ticket_id, as_dict=True)
    return result   

@frappe.whitelist()
def get_ticket_messages(ticket_id):
    query = """
        SELECT d.message, u.full_name as sender, d.date, CONCAT(UPPER(LEFT(u.first_name, 1)), UPPER(LEFT(u.last_name, 1))) AS profile, d.status_change, 
        d.sender as user, d.is_attachment, d.attachment_url
        FROM `tabInternal Ticket Description Table` d
        JOIN `tabUser` u ON d.sender = u.name
        WHERE d.parent = %s
        ORDER BY d.date ASC
    """
    result = frappe.db.sql(query, ticket_id, as_dict=True)

    ticket_query = """
        SELECT subject
        FROM `tabInternal Tickets`
        WHERE name = %s
    """
    ticket_result = frappe.db.sql(ticket_query, ticket_id, as_dict=True)
    subject_list = []
    if ticket_result:
        subject_list.append(ticket_result[0].get('subject'))
    return [result, subject_list]

@frappe.whitelist()
def get_all_data_for_create_ticket():
    departments = frappe.db.get_list("Departments", pluck= "department_name")
    teams = frappe.db.get_list("Teams", fields=["team_name", "team_of_department"])
    locations = frappe.db.get_list("Location", pluck="location_name")
    assigned_to = frappe.db.get_list("User", fields=["full_name", "department", "email"])
    departments_with_location = frappe.db.get_list("Department with Location", pluck="department_name")
    departments_with_teams = frappe.db.get_list("Department with Team", pluck="department_name")

    sorted_teams = {}
    for team in teams:
        department = team['team_of_department']
        team_name = team['team_name']
        
        # If the department is already in the dictionary, append the team name to the list
        if department in sorted_teams:
            sorted_teams[department].append(team_name)
        else:
            sorted_teams[department] = [team_name]

    sorted_assigned_to = {}
    for person in assigned_to:
        full_name = person['full_name']
        sorted_assigned_to[full_name] = {
            'email': person['email'],
            'department': person['department']
        }


    return {
        "departments": departments,
        "teams": sorted_teams,
        "locations": locations,
        "assigned_to": sorted_assigned_to,
        "departments_with_location": departments_with_location,
        "departments_with_teams": departments_with_teams,
        "users": sorted_assigned_to
    }

@frappe.whitelist()
def update_ticket_status(ticket_id, status, current_user, previous_status, full_name):
    if not ticket_id or not status or not current_user:
        return {"error": "Ticket ID, status and current user are required"}
    try:
        ticket = frappe.get_doc("Internal Tickets", ticket_id)
        ticket.ticket_status = status

        ticket.append("description", {
            "sender": current_user,
            "message": f"{full_name} changed the status from {previous_status} to {status}",
            "date": frappe.utils.now(),
            "status_change": True
        })

        ticket.append("ticket_timeline", {
            "user": current_user,
            "pre_status": previous_status,
            "post_status": status,
            "date_of_change": frappe.utils.now()
        })

        ticket.save()
        return {"success": True, "message": "Ticket status updated successfully"}
    except Exception as e:
        return {"error": str(e)}

@frappe.whitelist()
def update_ticket_priority(ticket_id, priority):
    if not ticket_id or not priority:
        return {"error": "Ticket ID and priority are required"}
    try:
        ticket = frappe.get_doc("Internal Tickets", ticket_id)
        ticket.priority = priority
        ticket.save()
        return {"success": True, "message": "Ticket priority updated successfully"}
    except Exception as e:
        return {"error": str(e)}

@frappe.whitelist()
def get_subticket_list_details(department):
    departments = frappe.get_list("Departments", pluck="department_name")
    statuses = frappe.get_list("Internal Ticket Status", pluck="status")
    assignees = frappe.get_list("User", fields=["full_name", "email"], filters={"department": department})

    return {
        "departments": departments,
        "statuses": statuses,
        "assignees": assignees
    }

@frappe.whitelist()
def update_ticket_due_date(ticket_id, due_date):
    if not ticket_id or not due_date:
        return {"error": "Ticket ID and due date are required"}
    try:
        ticket = frappe.get_doc("Internal Tickets", ticket_id)
        ticket.due_date = due_date
        ticket.save()
        return {"success": True, "message": "Ticket due date updated successfully"}
    except Exception as e:
        return {"error": str(e)}

@frappe.whitelist()
def update_ticket_description(ticket_id, message, current_user):
    if not ticket_id or not message or not current_user:
        return {"error": "Ticket ID, message and current user are required"}
    
    try:
        ticket = frappe.get_doc("Internal Tickets", ticket_id)
        ticket.append("description", {
            "sender": current_user,
            "message": message,
            "date": frappe.utils.now(),
            "status_change": False
        })
        ticket.save()
        return {"success": True, "message": "Ticket description updated successfully"}
    except Exception as e:
        return {"error": str(e)} 

@frappe.whitelist()
def update_ticket_description_for_attachment(ticket_id, current_user, file_url, full_name):
    if not ticket_id or not current_user:
        return {"error": "Ticket ID and current user are required"}
    
    try:
        ticket = frappe.get_doc("Internal Tickets", ticket_id)
        ticket.append("description", {
            "sender": current_user,
            "message": f"{full_name} has uploaded ",
            "date": frappe.utils.now(),
            "status_change": False,
            "is_attachment": True,
            "attachment_url": file_url
        })
        ticket.save()
        return {"success": True, "message": "Ticket description updated successfully"}
    except Exception as e:
        return {"error": str(e)}
    
@frappe.whitelist()
def update_ticket_department(ticket_id, department):
    if not ticket_id or not department:
        return {"error": "Ticket ID and department are required"}
    try:
        ticket = frappe.get_doc("Internal Tickets", ticket_id)
        ticket.assigned_department = department
        ticket.assigned_to = "unassigned@noveloffice.in"
        ticket.save()
        return {"success": True, "message": "Ticket department updated successfully"}
    except Exception as e:
        return {"error": str(e)}

@frappe.whitelist()
def get_parent_ticket(ticket_id):
    query = """
        SELECT parent_ticket    
        FROM `tabInternal Tickets`
        WHERE name = %s
    """

    query2 = """
        SELECT t.name, t.subject, t.ticket_status, t.creation, 
               t.assigned_to, u.full_name as assigned_to_name, t.due_date
        FROM `tabInternal Tickets` t
        LEFT JOIN `tabUser` u ON t.assigned_to = u.name
        WHERE t.name = %s
    """
    result = frappe.db.sql(query, ticket_id, as_dict=True)
    result2 = frappe.db.sql(query2, result[0].get('parent_ticket'), as_dict=True)
    return result2
    
@frappe.whitelist()
def update_ticket_assignee(ticket_id, assignee):
    if not ticket_id or not assignee:
        return {"error": "Ticket ID and assignee are required"}
    try:
        ticket = frappe.get_doc("Internal Tickets", ticket_id)
        ticket.assigned_to = assignee
        ticket.save()
        return {"success": True, "message": "Ticket assignee updated successfully"}
    except Exception as e:
        return {"error": str(e)}
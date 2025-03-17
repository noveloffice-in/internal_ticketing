import frappe

@frappe.whitelist()
def get_ticket_count_by_department(department: str):
    
    if not department:
        return {"error": "Department is required"}

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
    return result

def get_ticket_count_by_department_and_user():
    department = frappe.form_dict.get('department')
    user = frappe.form_dict.get('user')
    if not department or not user:
        return {"error": "Department and user are required"}

    query = """
        SELECT ticket_status, COUNT(*) as count
        FROM `tabTicket`
        WHERE assigned_department = %s AND assigned_to = %s
        GROUP BY ticket_status
    """
    result = frappe.db.sql(query, department, user, as_dict=True)

@frappe.whitelist()
def get_ticket_list():
    department = frappe.form_dict.get('department')
    if not department:
        return {"error": "Department is required"}

    query = """
        SELECT 
            tickets.name,
            tickets.subject, 
            users.full_name as assigned_to, 
            tickets.ticket_status, 
            tickets.due_date
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
    ticket.save()
    return {"success": "Ticket created successfully"}

@frappe.whitelist()
def get_ticket_sub_details(ticket_id):
    query = """
        SELECT assigned_to, due_date, ticket_status, priority, creation
        FROM `tabInternal Tickets`
        WHERE name = %s
    """
    result = frappe.db.sql(query, ticket_id, as_dict=True)

    if result:
        assigned_to = result[0].get('assigned_to')
        if assigned_to:
            user_query = """
                SELECT designation, full_name
                FROM `tabUser`
                WHERE name = %s
            """
            user_result = frappe.db.sql(user_query, assigned_to, as_dict=True)
            if user_result:
                result[0]['designation'] = user_result[0].get('designation')
                result[0]['full_name'] = user_result[0].get('full_name')

    return result

@frappe.whitelist()
def get_sub_ticket_info(ticket_id):
    query = """
        SELECT name, subject, ticket_status, priority, creation, assigned_to
        FROM `tabInternal Tickets`
        WHERE parent_ticket = %s
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
        SELECT d.message, u.full_name as sender, d.date
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
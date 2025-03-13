import frappe

def get_ticket_count_by_department():
    department = frappe.form_dict.get('department')
    if not department:
        return {"error": "Department is required"}

    query = """
        SELECT ticket_status, COUNT(*) as count
        FROM `tabTicket`
        WHERE assigned_department = %s
        GROUP BY ticket_status
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

def get_ticket_details_list():
    department = frappe.form_dict.get('department')
    if not department:
        return {"error": "Department is required"}

    query = """
        SELECT subject, assigned_to, ticket_status, due_date
        FROM `tabTicket`
        WHERE assigned_department = %s
        ORDER BY creation DESC
        """
    result = frappe.db.sql(query, department, as_dict=True)
    return result

def create_ticket():
    assigned_to = frappe.form_dict.get('assigned_to')
    assigned_department = frappe.form_dict.get('assigned_department')
    subject = frappe.form_dict.get('subject')
    description = frappe.form_dict.get('description')
    due_date = frappe.form_dict.get('due_date')
    message = frappe.form_dict.get('message')
    status = frappe.form_dict.get('status')
    priority = frappe.form_dict.get('priority')
    parent_ticket = frappe.form_dict.get('parent_ticket')

    ticket = frappe.new_doc("Internal Tickets")
    ticket.assigned_to = assigned_to
    ticket.assigned_department = assigned_department
    ticket.subject = subject
    ticket.description = description
    ticket.due_date = due_date
    ticket.message = message
    ticket.status = status
    ticket.priority = priority
    ticket.parent_ticket = parent_ticket

    ticket.save()
    return {"success": "Ticket created successfully"}


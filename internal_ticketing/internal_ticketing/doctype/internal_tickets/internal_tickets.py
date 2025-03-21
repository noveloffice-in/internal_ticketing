# Copyright (c) 2025, Nikhil Suresh and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class InternalTickets(Document):
	def after_insert(doc):
		frappe.publish_realtime('ticket_creation', {'ticket_id': doc.name})
		frappe.msgprint("Ticket Created")

		doc.db_set("approved", 1)


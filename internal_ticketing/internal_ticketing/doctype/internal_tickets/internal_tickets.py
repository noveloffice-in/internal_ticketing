# Copyright (c) 2025, Nikhil Suresh and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
import frappe
import requests
import json

class InternalTickets(Document):
	global Node_URL 
	Node_URL = "http://10.80.4.63:9001"

	def on_update(doc):
		data = {
			"event": "ticket_updated",
			"data": doc.as_dict()
		}
		headers = {"Content-Type": "application/json"}
		requests.post(Node_URL, json=data, headers=headers)
		frappe.msgprint("Event sent to Node")
		# send_event_to_node(data)

	def after_insert(doc):
		data = {
			"event": "new_ticket",
			"data": doc.as_dict()
		}
		headers = {"Content-Type": "application/json"}
		requests.post(Node_URL, json=data, headers=headers)
		frappe.msgprint("Event sent to Node")
		# send_event_to_node(data)





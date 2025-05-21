# Copyright (c) 2025, Nikhil Suresh and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
import frappe
import requests
import json
import traceback
from datetime import datetime

class InternalTickets(Document):
	global Node_URL 
	Node_URL = "http://10.80.4.63:9001"

	# def after_insert(self):
	# 	frappe.log_error("after_insert called", "DEBUG_HOOK")
	# 	try:
	# 		data = {
	# 			"event": "new_ticket",
	# 			"data": self.as_dict()
	# 		}
	# 		headers = {"Content-Type": "application/json"}
	# 		response = requests.post(Node_URL, data=frappe.as_json(data), headers=headers)
	# 		frappe.log_error(f"After Insert Node.js response: {response.status_code} - {response.text}", "DEBUG_NODE_RESPONSE")

	# 	except Exception as e:
	# 		tb = traceback.format_exc()
	# 		frappe.log_error(f"Exception: {str(e)}\nTraceback:\n{tb}", "Node.js POST error")


	def after_insert(self):
		frappe.log_error("after_insert called", "DEBUG_HOOK")
		try:
			# 🔍 Fetch users with the matching department
			department_users = frappe.get_all("User", 
				filters={"department": self.assigned_department, "user_permission_type": ["in", ["TL", "POC"]]},
				fields=["name"]
			)

			# 👥 Extract list of user names
			target_users = [user["name"] for user in department_users]

			# 📨 Prepare payload
			data = {
				"event": "ticket_notification",
				"data": self.as_dict(),
				"target_users": target_users
			}
			headers = {"Content-Type": "application/json"}

			# 🌐 Send to Node.js
			response = requests.post(Node_URL, data=frappe.as_json(data), headers=headers)
			frappe.log_error(f"After Insert Notification Node.js response: {response.status_code} - {response.text}", "DEBUG_NODE_RESPONSE")

		except Exception as e:
			tb = traceback.format_exc()
			frappe.log_error(f"Exception: {str(e)}\nTraceback:\n{tb}", "Node.js POST error")


	def on_update(self):
		frappe.log_error("on_update called", "DEBUG_HOOK")
		try:
			data = {
				"event": "ticket_updated",
				"data": self.as_dict()
			}
			headers = {"Content-Type": "application/json"}
			response = requests.post(Node_URL, data=frappe.as_json(data), headers=headers)
			frappe.log_error(
				f"ON Update Node.js response: {response.status_code}\nText: {response.text}\n",
				"DEBUG_NODE_RESPONSE"
			)

		except Exception as e:
			tb = traceback.format_exc()
			frappe.log_error(f"Exception: {str(e)}\nTraceback:\n{tb}", "Node.js POST error")



	
	




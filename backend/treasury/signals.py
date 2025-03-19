from datetime import datetime
from .models import Notification


def notify(message,for_user,deadline:datetime=None,**kwargs):
    notification = Notification( message=message)
    notification.save()
    notification.for_users.add(for_user)
    if deadline :
        notification.deadline = deadline
    notification.save()

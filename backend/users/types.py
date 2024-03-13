from django.db import models

class UserTypes (models.TextChoices):
    AGENT = ("AGENT", "Agent")
    MANAGER = ("MANAGER", "Manager")
    OWNER = ('OWNER','Owner')

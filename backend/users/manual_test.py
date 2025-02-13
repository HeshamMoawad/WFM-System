from django.db.models import Count , Case ,When , Value , CharField
from django.db.models.functions import TruncDate , TruncWeek
from datetime import datetime

from pandas import date_range
from .models import Lead , User , Project
from django.test import TestCase



class FilterLeadsByDayTest(TestCase):
    def test_filtering(self):
        user1 = User.objects.create(username="user1")
        user2 = User.objects.create(username="user2")
        project = Project.objects.create(name="Project A")

        # Create lead objects
        Lead.objects.create(user=user1, phone="1234567890", name="Lead 1", date="2024-12-01", project=project)
        Lead.objects.create(user=user1, phone="1234567891", name="Lead 2", date="2024-12-01", project=project)
        Lead.objects.create(user=user2, phone="1234567892", name="Lead 3", date="2024-12-02", project=project)
        Lead.objects.create(user=user2, phone="6545564564", name="Lead 4", date="2024-12-02", project=project)
        Lead.objects.create(user=user2, phone="6121616546", name="Lead 5", date="2024-12-02", project=project)
        Lead.objects.create(user=user2, phone="5454565654", name="Lead 6", date="2024-12-02", project=project)
        Lead.objects.create(user=user2, phone="8797132156", name="Lead 7", date="2024-12-02", project=project)
        Lead.objects.create(user=user2, phone="8797138856", name="Lead 7", date="2024-12-03", project=project)
        Lead.objects.create(user=user2, phone="8797144156", name="Lead 7", date="2024-12-04", project=project)

        # Set the date range
        start_date = datetime(2024 , 12, 1)
        end_date = datetime(2024 , 12, 30)
        # Query to group leads by user and date
        daily_leads = (
            Lead.objects
            .filter(date__range=[start_date, end_date])
            .values('user__username')  # Replace 'username' with relevant field from User
            .annotate(week=TruncWeek('date'))  # Truncate date to day level
            .annotate(total_leads=Count('uuid'))  # Count leads per day
            .annotate(get_deal=Case(
                When(total_leads__gte=5,then=Value("Got It")),
                default=Value('Not Got'),
                output_field=CharField(),  # Ensure output is a string
            ))
            .order_by( 'user__username','week')  # Sort results by day and user
        )

        # Display results
        for lead in daily_leads:
            print(f"Result Object : {lead}")
            print(f"User: {lead['user__username']}, Date: {lead['week']}, Total Leads: {lead['total_leads']}")

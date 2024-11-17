from django.test import TestCase
from django.utils.timezone import now
from .models import Project, Department, User, FingerPrintID, ArrivingLeaving, Profile, Lead, UpdateHistory, Request, ZKConfig, ReportRecord


class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")

    def test_project_creation(self):
        self.assertEqual(self.project.name, "Test Project")
        self.assertEqual(str(self.project), "Test Project")


class DepartmentModelTest(TestCase):
    def setUp(self):
        self.department = Department.objects.create(name="HR")

    def test_department_creation(self):
        self.assertEqual(self.department.name, "HR")
        self.assertEqual(str(self.department), "HR")


class UserModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")
        self.department = Department.objects.create(name="Sales")
        self.user = User.objects.create(
            username="testuser",
            password_normal="plaintextpassword",
            project=self.project,
            role="AGENT",
            title="Agent",
            department=self.department,
            crm_username="testcrm",
            annual_count=5
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.project, self.project)
        self.assertEqual(self.user.role, "AGENT")
        self.assertEqual(str(self.user), "testuser")

    def test_user_password_set(self):
        self.assertTrue(self.user.check_password("plaintextpassword"))

    def test_user_profile_created_signal(self):
        # Test profile created by profile_creator_signal
        profile = Profile.objects.get(user=self.user)
        self.assertIsNotNone(profile)
        self.assertEqual(profile.user, self.user)


class FingerPrintIDModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="fp_user", password_normal="fp_password")
        self.fingerprint = FingerPrintID.objects.create(name="Office PC", user=self.user, unique_id="FP123")

    def test_fingerprint_creation(self):
        self.assertEqual(str(self.fingerprint), "Office PC - fp_user")
        self.assertEqual(self.fingerprint.user, self.user)
        self.assertEqual(self.fingerprint.unique_id, "FP123")


class ArrivingLeavingModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="arrive_user", password_normal="arrive_password")
        self.arriving_time = now()
        self.leaving_time = now()
        self.record = ArrivingLeaving.objects.create(
            user=self.user,
            date=now().date(),
            arriving_at=self.arriving_time,
            leaving_at=self.leaving_time
        )

    def test_arriving_leaving_creation(self):
        self.assertEqual(self.record.user, self.user)
        self.assertEqual(self.record.arriving_at, self.arriving_time)
        self.assertEqual(self.record.leaving_at, self.leaving_time)

    def test_duration_calculation(self):
        self.record.save()  # Should calculate duration in `deuration_between`
        duration = (self.record.leaving_at - self.record.arriving_at).total_seconds()
        self.assertEqual(self.record.deuration_between, duration)


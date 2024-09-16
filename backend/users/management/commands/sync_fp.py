from django.core.management.base import BaseCommand
from zk import ZK, const
from zk.attendance import Attendance
from zk.user import User as ZkUser
from zk.finger import Finger
from typing import List
from pandas import DataFrame
from users.models import User


class Command(BaseCommand):
    help = 'Runs periodic tasks'
    
    
    def add_arguments(self, parser):
        parser.add_argument('--ip', type=str, default="192.168.11.157", help='ZK IPAddress')
        parser.add_argument('--port', type=int, default=4370, help='ZK Port')
        parser.add_argument('--timeout', type=int, default=5, help='ZK Timeout Connection')
        parser.add_argument('--password', type=str, default=0, help='ZK password')
        parser.add_argument('--user', type=str, default=None, help='ZK Sync Exact User')


    def handle(self, *args, **kwargs):
    
        self.stdout.write(f"Start Zk FP Syncing on {kwargs.get('ip')}:{kwargs.get('port')}   ....")
        
        conn = None
        # # create ZK instance
        zk = ZK(kwargs.get("ip"), port=kwargs.get("port"), timeout=kwargs.get("timeout"), password=kwargs.get("password"), force_udp=False, ommit_ping=False)

        try : 
            # connect to device
            conn = zk.connect()
            self.stdout.write(self.style.SUCCESS(f"Successfully Connected to Zk Serial : {conn.get_serialnumber()} "))
            # disable device, this method ensures no activity on the device while the process is run
            conn.disable_device()
            self.stdout.write(self.style.SUCCESS(f"Disabled other activity ..."))


            conn.enable_device()
            self.stdout.write(self.style.SUCCESS(f"Enable activity again ..."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Process terminate : {e}"))
        finally:
            if conn:
                conn.disconnect()
        self.stdout.write("Periodic task Ended!")
        

    def _get_attend_with_user(self , conn:ZK)->DataFrame:
        attendance:List[Attendance] = conn.get_attendance()
        self.stdout.write(self.style.SUCCESS(f"Attendance Loaded : {len(attendance)} ..."))
        # users:List[ZkUser] = conn.get_users()
        # self.stdout.write(self.style.SUCCESS(f"Users Loaded : {len(users)} ..."))
        self.stdout.write(self.style.SUCCESS(f"Creating Dataframe to make analytics ..."))
        
        
        df = DataFrame(data=attendance,columns=["Attendance"])
        df['username'] = df["Attendance"].map(lambda attend:list(filter(lambda usr:usr.fp_id == attend.user_id,User.objects.all()))[""])
        
        
        df['timestamp'] = df["Attendance"].map(lambda attend:attend.timestamp)
        df['status'] = df["Attendance"].map(lambda attend:attend.status)
        df['punch'] = df["Attendance"].map(lambda attend:attend.punch)

        
        return df
    
    
# df = DataFrame(data=attendance,columns=["Attendance"])
# df['user_id'] = df["Attendance"].map(lambda attend:attend.user_id)
# df['username'] = df["Attendance"].map(lambda attend:list(filter(lambda usr:usr.user_id == attend.user_id,users))[0].name)
# df['timestamp'] = df["Attendance"].map(lambda attend:attend.timestamp)
# df['status'] = df["Attendance"].map(lambda attend:attend.status)
# df['punch'] = df["Attendance"].map(lambda attend:attend.punch)

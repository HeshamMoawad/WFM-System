const t = (arKey:string,enKey:string)=> ({ar:arKey,en:enKey})

export const BASE_URL = "http://192.168.11.251:8000/"

export const WEEK_DAYS = [
  t("الاحد","Sun"), 
  t("الاثنين","Mon"), 
  t("الثلاثاء","Tue"), 
  t("الاربعاء","Wed"), 
  t("الخميس","Thu"), 
  t("الجمعة","Fri"), 
  t("السبت","Sat")
]

export const numbersOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: true,
}

export const TRANSLATIONS = {
  Labels:[
    {label:"العربية",value:"ar"} ,
    {label:"English",value:"en"} ,
  ],
  Direction:t('rtl','ltr'),
  Date:t("التاريخ","Date") ,
  Request:{
    Type:t("نوع الطلب","Request Type"),
    Types:[
      {
        value:"GLOBAL",
        translate:t("عام","Global")
      },
      {
        value:"ANNUAL",
        translate:t("انوال","Annual")
      },
      {
        value:"VACATION",
        translate:t("اجازة","Vacation")
      },
      {
        value:"LATE",
        translate:t("تأخير","Late")
      },
    ],
    Details:t("التفاصيل","Details"),
    Submit:t("ارسال","Send")
  },
  Dashboard:{
    middleLabel:t("تاريخ اليوم","Today's Date"),
    login:t("حضور" , "Login"),
    logout:t("انصراف" , "Logout"),
    Alerts:{
      Arrive:{
        onSuccess:t("تم الحضور بنجاح","Success Arrived") ,
        onFaild:t("فشل تسجيل الحصور","Faild to Arrived")
       
      },
      Leave:{
        onSuccess:t("تم الانصراف بنجاح","Success Leave") ,
        onFaild:t("فشل تسجيل الانصراف","Faild to Leave")
      }
    }
  },
  Login:{
    username:t("اسم المستخدم","Username"),
    password:t("كلمة المرور","Password"),
    SignIn:t("تسجيل الدخول","Sign In") ,
    ForgetPassword:t("لقد نسيت كلمة المرور","Forget Password"),
    Login:t("تسجيل الدخول","Login"),
    Alerts:{
      onSuccess:t("تم تسجيل الدخول بنجاح","Successfully Logged in"),
      onFaild:t("فشل تسجيل الدخول","Login failed")
    }
  },
  Profile: {
    Picture:t("صورة الملف الشخصى","Picture"),
    Phone:t("رقم الهاتف","Phone"),
    About:t("حول","About"),
    TelegramID:t("رقم التيلجرام ID","Telegram ID"),
    Alerts:{
      onSuccessUpdate:t("التحديث تم بنجاح","Success Update"),
      onFaildUpdate:t("فشل التحديث","Update Faild"),
    }
  },
  AttendanceDetails:{
    title:t("تفاصيل البصمة","Attendance Details"),
    table:{
      headers: {
        ar:["التاريخ","يوم الاسبوع","حضور","انصراف","مدة الشيفت" , "التاخير" , "الانصراف مبكرا","الخصم"],
        en:["date","DayOfWeek","arrived at","leaving at","deuration" , "late" , "departure","deduction"],
      }
    },
    bottomBar:{
      lateCount:t("عدد التاخيرات","Late Count"), 
      departureCount:t(" الانصراف مبكرا","Departure Count"), 
      AttendanceCount:t("عدد ايام الحضور","Attendance Count"), 
      deuctionCount:t("عدد ايام الخصم","Deduction Count (Days)"), 
      percentageCount:t("نسبة التاخير","Late Percentage")
    }
  },
  Advance:{
    bottom:{
      total:t("اجمالى السلف","Total Advance")
    }
  }
}

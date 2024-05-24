// General User 
export const GET_USER = "/userapi/user";
export const LOGIN = "/userapi/login";
export const FORGOT_PASSWORD = "/userapi/forgotpassword";
export const GET_LOGGEDIN_PATIENT_ID = "userapi/get/loggedin/patient/id";
export const GET_LOGGEDIN_PATIENT_NAME = "/userapi/get/loggedin/patient/name";
export const GET_DOCTOR_ID = "/userapi/get/loggedin/doctor/id";
export const GET_DOCTOR_NAME = "/userapi/get/loggedin/doctor/name";
// admin dashboard
export const GET_PATIENT_COUNT = "/admin_dashboard/get/patientcount/";
export const GET_DOCTOR_COUNT = "/admin_dashboard/get/doctorcount/";
export const GET_APPOINTMENT_COUNT = "/admin_dashboard/get/appointmentcount/";
export const GET_AVERAGE_RATING = "/admin_dashboard/get/averagerating/";
export const GET_APPOINTMENT_COUNT_BY_YEAR = "/admin_dashboard/get/appointmentpermonth/";
export const GET_USER_GENDER_DISTRIBUTION = "/admin_dashboard/get/gender/distribution"; 
export const GET_DOCTOR_PERFORMANCE ="admin_dashboard/get/doctor/performance/";
// doctor dashboard
export const GET_PATIENT_COUNT_BY_DOCTOR = '/doctor_dashboard/get/count/patient';
export const GET_APPOINTMENT_COUNT_BY_DOCTOR = '/doctor_dashboard/get/count/appointment';
export const GET_AVG_RATING_BY_DOCTOR = '/doctor_dashboard/get/avg/rating';
export const GET_AVG_PATIENT_AGE = '/doctor_dashboard/get/avg/patient/age';
export const GET_PATIENT_GENDER_DISTRIBUTION = '/doctor_dashboard/get/gender/distribution';
export const GET_APPOINTMENT_DISTRIBUTION_BY_DOCTOR = '/doctor_dashboard/get/appointment/distribution/';
//patient dashboard
export const GET_LATEST_MEDICATIONS = '/patient_dashboard/get/medications';
export const GET_TOP_PAINPOINTS = 'patient_dashboard/get/painpoints';
export const GET_PATIENT_APPOINTMENT_COUNT = 'patient_dashboard/get/count/appointment';
export const GET_TOTAL_TESTS = 'patient_dashboard/get/count/tests';
export const GET_AVG_WEIGHT = 'patient_dashboard/get/avg/weight';
export const GET_AVG_SUGAR = 'patient_dashboard/get/avg/sugar';
export const GET_AVG_OXYGEN = 'patient_dashboard/get/avg/oxygen';
export const GET_TOP_DOCTOR = 'patient_dashboard/get/top/doctor';
export const GET_PATIENT_YEAR = 'patient_dashboard/get/patient/years';
export const GET_WEIGHT_DISTRIBUTION = 'patient_dashboard/get/weight/distribution/';
export const GET_OXYGEN_DISTRIBUTION = 'patient_dashboard/get/oxygen/distribution/';
export const GET_SUGAR_DISTRIBUTION = 'patient_dashboard/get/sugar/distribution/';
export const GET_PULSE_DISTRIBUTION = 'patient_dashboard/get/pulse/distribution/';
export const GET_BLOODPRESSURE_DISTRIBUTION = 'patient_dashboard/get/bloodpressure/distribution/';
//Departments
export const GET_CREATE_DEPARTMENT = "/department"
export const GET_DEPARTMENT = "department/";
//Doctors
export const GET_DOCTORS = "userapi/get/doctors";
export const GET_DOCTOR_BY_ID = "userapi/get/doctor/id/";
export const DELETE_DOCTOR = "userapi/delete/doctor/";
export const ADD_DOCTOR = "userapi/add/doctor";
export const UPDATE_DOCTOR = "userapi/update/doctor/";
//Patients
export const GET_PATIENT = "userapi/get/patient";
export const GET_PATIENT_BY_ID = "userapi/patient/";
export const ADD_PATIENT = "userapi/add/patient";
export const GET_PATIENT_BY_NAME = "userapi/get/patientid/";
//Appointment Slots
export const GET_OR_ADD_SLOT = "appointmentslots/";
export const UPD_DEL_GET_SLOT = "appointmentslots/detail/";
export const GET_APPTS_BY_DOC = "appointmentslots/appointments/";
//Appointments
export const GET_ADD_APPOINTMENT = "appointment/";
export const GET_UPD_DEL_APPOINTMENT = "appointment/detail/";
export const GET_TODAYS_APPOINTMENTS = "appointment/get/today/appointment";
export const GET_PREV_APPOINTMENT = "appointment/get/";
export const RATE_APPOINTMENT = "appointment/rate/";
export const GET_TODAYS_APPOINTMENTS_PATIENT = 'appointment/get/today/patient/appointment';
export const GET_TODAYS_APPOINTMENTS_ADMIN = 'appointment/get/today/admin/appointment';
//booked slots
export const GET_BOOKED_SLOTS = "appointment/booked/slots"
export const GET_BOOKED_SLOTS_BY_PATIENT = "appointment/booked/";
export const GET_BOOKED_SLOTS_BY_DOCTOR = "appointment/booked/doc/";
//healthsnapshots
export const GET_ADD_HEALTH_SNAPSHOTS = "healthsnapshot/";
export const GET_HEALTH_SNAPSHOTS_BY_APPOINTMENT = "healthsnapshot/appointment/";
//painpoints 
export const GET_ADD_DELETE_PAINPOINTS = "painpoint/";
export const GET_PAINPOINTS_BY_APPOINTMENT = "painpoint/appointment/";  
//suggestions
export const GET_ADD_DELETE_SUGGESTIONS = "doctorsuggestion/";
export const GET_SUGGESTIONS_BY_APPOINTMENT = "doctorsuggestion/appointment/";
//tests
export const GET_ADD_DELETE_TESTS = "medicaltests/";
export const GET_TESTS_BY_APPOINTMENT = "medicaltests/appointment/";
export const UPLOAD_IMAGE = "medicaltests/upload/"
//prescriptions
export const GET_ADD_DELETE_PRESCRIPTIONS = "prescription/";
export const GET_PRESCRIPTIONS_BY_APPOINTMENT = "prescription/appointment/";
//articles
export const GET_ADD_ARTICLES = "articles/";
export const GET_DELETE_ARTICLES = "articles/";
//others
export const GET_UNIQUE_YEARS = "/appointment/get/uniqueyears";
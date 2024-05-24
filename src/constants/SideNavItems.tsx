import {
  BookOpen,
  CalendarCheck,
  CalendarClock,
  FileStack,
  GalleryVerticalEnd,
  Home,
  Rows3,
  UserCog,
  UsersRound,
} from "lucide-react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export const ADMIN_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/admin/home",
    icon: <Home size={17} />,
  },
  {
    title: "Departments",
    path: "/departments",
    icon: <Rows3 size={17} />,
  },

  {
    title: "Users",
    path: "/",
    icon: <UsersRound size={17} />,
    submenu: true,
    subMenuItems: [
      {
        title: "Doctors",
        path: "/users/doctors",
        icon: <UsersRound size={17} />,
      },
      {
        title: "Patients",
        path: "/users/patients",
        icon: <UsersRound size={17} />,
      },
    ],
  },
  {
    title: "Appointment Slots",
    path: "/admin/appointment/slots",
    icon: <GalleryVerticalEnd size={17}  />,
  },
  {
    title: 'Articles',
    path: '/',
    icon: <BookOpen size={17}/>,
    submenu: true,
    subMenuItems: [
      {
        title: "All Articles",
        path: "/all/articles",
        icon: <UsersRound size={17} />,
      },
      {
        title: "Approved Articles",
        path: "/articles",
        icon: <UsersRound size={17} />,
      },
    ]
  },
  {
    title: "Book Appointment",
    path: "/admin/appointments/",
    icon: <CalendarCheck size={17}  />,
  },
  {
    title: "All Appointments",
    path: "/admin/all/appointments/",
    icon: <FileStack size={17}  />,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <UserCog size={17} />,
  },
];

export const DOCTOR_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/doctor/home",
    icon: <Home size={17}  />,
  },
  {
    title : "Appointments",
    path: "/doctor/appointments",
    icon: <CalendarCheck size={17}  />
  },
  {
    title: "Patients",
    path: "/patients",
    icon: <UsersRound size={17} />,
  },
  {
    title: "Schedule",
    path: "/doctor/schedule",
    icon: <CalendarClock size={17}/>
  },
  {
    title: "History",
    path: "/doctor/history",
    icon: <FileStack size={17}/>
  },
  {
    title: 'Articles',
    path: '/',
    icon: <BookOpen size={17}/>,
    submenu: true,
    subMenuItems: [
      {
        title: "All Articles",
        path: "/all/articles",
        icon: <UsersRound size={17} />,
      },
      {
        title: "Approved Articles",
        path: "/articles",
        icon: <UsersRound size={17} />,
      },
    ]
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <UserCog size={17} />,
  },
];
export const PATIENT_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/patient/home",
    icon: <Home size={17}  />,
  },
  {
    title: "Departments",
    path: "/departments",
    icon: <Rows3 size={17}  />,
  },
  {
    title: "Doctors",
    path: "/doctors",
    icon: <UsersRound size={17} />,
  },
  {
    title: "Book Appointment",
    path: "/book/appointments/",
    icon: <CalendarCheck size={17}  />,
  },
  {
    title: "History",
    path: "/patient/history",
    icon: <FileStack size={17}/>
  },
  {
    title: 'Articles',
    path: "/articles",
    icon: <BookOpen size={17}/>,

  },
  {
    title: "Profile",
    path: "/profile",
    icon: <UserCog size={17} />,
  },
];

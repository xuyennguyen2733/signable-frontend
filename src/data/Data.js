// Sidebar imports
import {
  IoHome,
  IoPerson,
  IoPeopleSharp,
  IoSettingsOutline,
} from "react-icons/io5";

import {
  BsAlphabetUppercase,
  BsChat,
  BsChatLeftQuote,
  BsFillChatSquareTextFill,
} from "react-icons/bs";

export const api_url = process.env.DEV == "True" ? `http://127.0.0.1:8000` : `https://signable-fastapi-d0hkhvazdpchc9cz.westus2-01.azurewebsites.net`;
// Sidebar Data
export const SidebarData = [
  {
    icon: IoHome,
    heading: "Dashboard", 
  },
  {
    icon: IoPerson,
    heading: "Profile",
  },
  {
    icon: IoPeopleSharp,
    heading: "Friends",
  },
  {
    icon: IoSettingsOutline,
    heading: "Settings",
  },
];

export const AdminDashboardData = [
  {
    name: "Questions",
  },
  {
    name: "Lessons",
  },
  {
    name: "Units",
  },
  {
    name: "Signs",
  },
]


export const fetchUnitCardData = async () => {
  try {
    const response = await fetch(`${api_url}/units/`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.units.map((unit) => ({
      title: unit.title,
      id: unit.unit_id,
      // TODO - let card decide it's own color based on user porgress
      color: {
        backGround: "linear-gradient(180deg, #f58b0a 25%, #354cfc 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      description: unit.description,
      numLessons: unit.lesson_count,
      icon: getIconComponent(unit.unit_id),
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchLessonCardData = async (unitId) => {
  try {
    const response = await fetch(`${api_url}/units/${unitId}/lessons`);
    if (!response.ok) {
      throw new Error("Failed to fetch lesson data");
    }
    const data = await response.json();
    return { data: data.lessons };
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getIconComponent = (unitId) => {
  switch (unitId) {
    case 1:
      return BsAlphabetUppercase;
    case 2:
      return BsChat;
    case 3:
      return BsChatLeftQuote;
    case 4:
      return BsFillChatSquareTextFill;
    case 5:
      return BsAlphabetUppercase;
    default:
      return null;
  }
};

export const unitCardData = await fetchUnitCardData();

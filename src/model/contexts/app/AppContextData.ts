import { Camp } from "@/model/entities/Camp";
import { UserInfo } from "@/services/umobi/models/UserInfo";

export type AppContextData = {
  isLoading: boolean;
  userInfo: UserInfo;
  events: Camp[];
  hasAvailableEvents: boolean;
  setIsLoading: (isLoading: boolean) => void;  
  setUserInfo: (userInfo: UserInfo) => void;
  setEvents: (events: Camp[]) => void;
}
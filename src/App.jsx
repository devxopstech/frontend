import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import PhoneSignup from "./pages/PhoneSignup";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";
import MySchedules from "./pages/MySchedules";
import CreateSchedule from "./pages/CreateSchedule";
import NewSchedule from "./pages/NewSchedule";
import ScheduleSettings from "./pages/ScheduleSettings";
import ScheduleMain from "./pages/ScheduleMain";
import PrioritiesSubmission from "./pages/PrioritiesSubmission";
import CurrentPriorities from "./pages/CurrentPriorities";
import AddEmployee from "./pages/AddEmployee";
import EmployeesList from "./pages/EmployeesList";
import ScheduleBuild from "./pages/ScheduleBuild";
import Archive from "./pages/Archive";
import ShareAndPrint from "./pages/ShareAndPrint";
// import Chat from "./pages/Chat";
import ChatRooms from "./pages/ChatRooms";
import ChatRoom from "./pages/ChatRoom";
import ProfileSettings from "./pages/ProfileSettings";
import CalendarExport from "./pages/CalendarExport";
import InviteUsers from "./pages/InviteUsers";
import ChangeScheduleSettings from "./pages/ChangeScheduleSettings";
import { ScheduleProvider } from "./context/ScheduleContext";
import ComingSoon from "./pages/ComingSoon";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import WorkArrangements from "./pages/WorkArrangements";
import { LimitedRoute } from "./components/LimitedRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";
import Upgrade from "./pages/Upgrade";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "sonner";
import AuthSuccess from "./pages/AuthSuccess";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <UserProvider>
          <ScheduleProvider>
            <ChatProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Onboarding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<CreateAccount />} />
                <Route path="/home" element={<Home />} />
                <Route path="/schedules" element={<MySchedules />} />
                <Route path="/premium" element={<CreateSchedule />} />
                <Route path="/new-schedule/name" element={<NewSchedule />} />
                <Route
                  path="new-schedule/settings"
                  element={<ScheduleSettings />}
                />
                <Route
                  path="/schedule/:scheduleId"
                  element={<ScheduleMain />}
                />
                <Route
                  path="/submit-priorities/:scheduleId"
                  element={<PrioritiesSubmission />}
                />
                <Route
                  path="/current-priorities/:scheduleId"
                  element={<CurrentPriorities />}
                />
                <Route
                  path="/add-employee/:scheduleId"
                  element={<AddEmployee />}
                />
                <Route
                  path="/employee-list/:scheduleId"
                  element={<EmployeesList />}
                />
                <Route path="/scheduleBuild" element={<ScheduleBuild />} />

                <Route path="/chat-rooms" element={<ChatRooms />} />
                <Route path="/chat/:roomId" element={<ChatRoom />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                {/* Protected premium routes */}
                <Route
                  path="/share/:scheduleId"
                  element={
                    <ProtectedRoute feature="shareSchedule">
                      <ShareAndPrint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/export/:scheduleId"
                  element={
                    <ProtectedRoute feature="exportSchedule">
                      <CalendarExport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/archive/:scheduleId"
                  element={
                    <ProtectedRoute feature="archiveAccess">
                      <Archive />
                    </ProtectedRoute>
                  }
                />
                <Route path="/invite-users" element={<InviteUsers />} />
                <Route
                  path="/schedule/:scheduleId/settings"
                  element={<ChangeScheduleSettings />}
                />
                {/* Catch-all route for 404 pages */}
                <Route path="*" element={<ComingSoon />} />
                <Route
                  path="/users/verify/:token"
                  element={<EmailVerification />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/users/reset/:token" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                {/* Limited-use routes */}
                <Route
                  path="/work-arrangements/:scheduleId"
                  element={<WorkArrangements />}
                />
                <Route path="/upgrade" element={<Upgrade />} />

                <Route path="/auth-success" element={<AuthSuccess />} />

              </Routes>
            </ChatProvider>
          </ScheduleProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

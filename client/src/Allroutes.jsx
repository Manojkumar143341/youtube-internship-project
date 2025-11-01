import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";
import Videopage from "./Pages/Videopage/Videopage";
import Channel from "./Pages/Channel/Channel";
import Library from "./Pages/Library/Library";
import Likedvideo from "./Pages/Likedvideo/Likedvideo";
import Watchhistory from "./Pages/Watchhistory/Watchhistory";
import Watchlater from "./Pages/Watchlater/Watchlater";
import Yourvideo from "./Pages/Yourvideo/Yourvideo";
import GroupsPage from "./Pages/Groups/GroupsPage";
import SubscriptionPlansPage from "./Pages/SubscriptionPlansPage"; // ✅ default import
import Download from "./Pages/Download/Download";
import VoIPCall from "./Component/VoIPCall/VoIPCall";
import SignInPage from "./Pages/Auth/SignInPage"; // ✅ default import
import SignUpPage from "./Pages/Auth/SignUpPage"; // ✅ default import
import CommentsPage from "./Pages/CommentsPage/CommentsPage";
import PaymentPage from "./Pages/Payment/PaymentPage";
import Profile from "./Pages/Profile/Profile"; // ✅ default import

const Allroutes = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search/:Searchquery" element={<Search />} />
      <Route path="/videopage/:vid" element={<Videopage />} />
      <Route path="/library" element={<Library />} />
      <Route path="/likedvideo" element={<Likedvideo />} />
      <Route path="/watchhistory" element={<Watchhistory />} />
      <Route path="/watchlater" element={<Watchlater />} />
      <Route path="/yourvideo" element={<Yourvideo />} />

      {/* keep only ONE subscription route */}
      <Route path="/subscriptionplans" element={<SubscriptionPlansPage />} />

      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/login" element={<SignInPage />} /> {/* alias for login */}
      <Route path="/profile" element={<Profile />} />

      <Route
        path="/channel/:cid"
        element={
          <Channel
            seteditcreatechanelbtn={seteditcreatechanelbtn}
            setvideouploadpage={setvideouploadpage}
          />
        }
      />

      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/download" element={<Download />} />
      <Route path="/comments/:videoId" element={<CommentsPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/video-call" element={<VoIPCall />} />
    </Routes>
  );
};

export default Allroutes;

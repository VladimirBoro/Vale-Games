export function setCurrentUserProfilePic(profilePic) {
    localStorage.setItem("profilePic", profilePic);
    window.dispatchEvent(new Event("storage"));
} 
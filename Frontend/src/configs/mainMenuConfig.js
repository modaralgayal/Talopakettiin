const menuMenuConfig = [
  { name: "Home", path: "/", userType: "all" },
  { name: "About", path: "#about", userType: "all" },
  { name: "Contact Us", path: "#contact", userType: "all" },
  { name: "Form page", path: "/formpage", userType: "customer" },
  //customer
  {
    name: "View My Applications",
    path: "/viewmyapplications",
    userType: "customer",
  },
  { name: "View My Offers", path: "/viewmyoffers", userType: "customer" },
  //provider
  {
    name: "View All Applications",
    path: "/allapplications",
    userType: "provider",
  },
  //one sign in to rule them all
  { name: "Sign In", path: "/customersignin", userType: "all" },
  // { name: "Log Out", path: "/customersignin", userType: "all" },
];
export default menuMenuConfig;

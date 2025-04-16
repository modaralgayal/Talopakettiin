const menuMenuConfig = [
  { name: "Home", path: "/", userType: "all" },
  { name: "About", path: "#about", userType: "all" },
  { name: "Contact Us", path: "#contact", userType: "all" },
  // { name: "For Providers", path: "/providersignin", userType: "all" },
  { name: "Form page", path: "/formpage", userType: "all" },
  //customer
  {
    name: "View My Applications",
    path: "/viewmyapplications",
    userType: "customer",
  },
  { name: "View My Offers", path: "/viewmyoffers", userType: "customer" },
  //provider
  { name: "View All Applications", path: "/allapplications" },
  //one sign in to rule them all
  { name: "Sign In", path: "/customersignin", userType: "all" },
  // { name: "Log Out", path: "/customersignin", userType: "all" },
];
export default menuMenuConfig;

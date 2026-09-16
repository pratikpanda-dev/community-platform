import "./HomeDashboard.css";

const quickLinks = [
  {
    id: "attendance",
    title: "Attendance",
    description: "Check in, check out, and view today's attendance.",
  },
  {
    id: "amenities",
    title: "Amenities",
    description: "Browse facilities and reserve an available time slot.",
  },
  {
    id: "complaints",
    title: "Complaints",
    description: "Raise and follow up on community concerns.",
  },
];

export default function HomeDashboard({ currentUser, onNavigate }) {
  const isAdmin = currentUser.role === "ADMIN";
  const firstName = currentUser.name?.split(" ")[0] || "there";
  const links = isAdmin
    ? [
        ...quickLinks,
        {
          id: "employees",
          title: "Employee Management",
          description: "Add, update, and manage community employees.",
        },
      ]
    : quickLinks;

  return (
    <section className="home-dashboard">
      <div className="home-hero">
        <p className="home-eyebrow">Community Platform</p>
        <h1>Welcome back, {firstName}</h1>
        <p>
          {isAdmin
            ? "Manage your community and stay up to date with daily activity."
            : "Everything you need for your community, in one place."}
        </p>
      </div>

      <div className="home-section-heading">
        <h2>Quick access</h2>
        <p>Choose where you would like to go.</p>
      </div>

      <div className="home-link-grid">
        {links.map((link) => (
          <button
            key={link.id}
            className="home-link-card"
            onClick={() => onNavigate(link.id)}
          >
            <span className="home-link-title">{link.title}</span>
            <span className="home-link-description">{link.description}</span>
            <span className="home-link-action">Open →</span>
          </button>
        ))}
      </div>
    </section>
  );
}

import Header from "../components/Header";
import Footer from "../components/Footer";
import React,{useEffect,useState} from "react";
import "./Units.css";

const units = [
  {
    name: "CHOLAS",
    color: "pink",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brihadisvara%20Temple-WUS02656.jpg",
    importance:
      "The Cholas are remembered for their powerful administration, maritime achievements and magnificent temple architecture.",
    volunteers: 96,
    coordinator: "R.Swathi",
  },
  {
    name: "KAKATIYAS",
    color: "green",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Thousandpillar%20temple%2C%20Warangal.jpg",
    importance:
      "The Kakatiyas are known for their remarkable architecture, water management and contribution to the cultural heritage of Telangana.",
    volunteers: 98,
    coordinator: "Ch.Haritha",
  },
  {
    name: "SATAVHANAS",
    color: "orange",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/AMARAVATHI%20STUPA%2002.jpg",
    importance:
      "The Satavahanas played an important role in the development of trade, culture, art and Buddhism across the Deccan region.",
    volunteers: 100,
    coordinator: "P.Swetha Reddy",
  },
  {
    name: "VIJAYANAGARAS",
    color: "purple",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Virupaksha%20Temple%20-%20DSC%200034lk.jpg",
    importance:
      "The Vijayanagara Empire became a major centre of art, architecture, learning and cultural development in South India.",
    volunteers: 97,
    coordinator: "Rakshitha",
  },
  {
    name: "PALLAVAS",
    color: "blue",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mahabalipuram%20Pallavas%20Shore%20Temple.jpg",
    importance:
      "The Pallavas made significant contributions to South Indian temple architecture, sculpture, education and cultural heritage.",
    volunteers: 88,
    coordinator: "M.Spandana",
  },
];


const teamPanels = [
  {
    title: "Advisors",
    subtitle: "Guidance & Leadership",
    icon: "★",
    members: [
      {
        name: "Advisor 01",
        role: "NSS Advisor",
        image: "/images/volunteers/advisor01.jpg",
      },
      {
        name: "Advisor 02",
        role: "NSS Advisor",
        image: "/images/volunteers/advisor02.jpg",
      },
    ],
  },
  {
    title: "AURS",
    subtitle: "Coordination & Representation",
    icon: "◆",
    members: [
      {
        name: "AURS Member 01",
        role: "AURS Member",
        image: "/images/volunteers/aurs01.jpg",
      },
      {
        name: "AURS Member 02",
        role: "AURS Member",
        image: "/images/volunteers/aurs02.jpg",
      },
    ],
  },
  {
    title: "UR Panel",
    subtitle: "Unit Representatives",
    icon: "✦",
    members: [
      {
        name: "UR Member 01",
        role: "Unit Representative",
        unit: "CHOLAS",
        image: "/images/volunteers/ur01.jpg",
      },
      {
        name: "UR Member 02",
        role: "Unit Representative",
        unit: "KAKATIYAS",
        image: "/images/volunteers/ur02.jpg",
      },
      {
        name: "UR Member 03",
        role: "Unit Representative",
        unit: "SATAVHANAS",
        image: "/images/volunteers/ur03.jpg",
      },
      {
        name: "UR Member 04",
        role: "Unit Representative",
        unit: "VIJAYANAGARAS",
        image: "/images/volunteers/ur04.jpg",
      },
      {
        name: "UR Member 05",
        role: "Unit Representative",
        unit: "PALLAVAS",
        image: "/images/volunteers/ur05.jpg",
      },
    ],
  },
  {
    title: "Activity Planning & Organising",
    subtitle: "Planning • Coordination • Execution",
    icon: "◆",
    members: [
      {
        name: "Activity Member 01",
        role: "Planning & Organising",
        image: "/images/volunteers/activity01.jpg",
      },
      {
        name: "Activity Member 02",
        role: "Planning & Organising",
        image: "/images/volunteers/activity02.jpg",
      },
      {
        name: "Activity Member 03",
        role: "Planning & Organising",
        image: "/images/volunteers/activity03.jpg",
      },
      {
        name: "Activity Member 04",
        role: "Planning & Organising",
        image: "/images/volunteers/activity04.jpg",
      },
      {
        name: "Activity Member 05",
        role: "Planning & Organising",
        image: "/images/volunteers/activity05.jpg",
      },
    ],
  },
  {
    title: "Technical Team",
    subtitle: "Technology & Digital Support",
    icon: "⌘",
    members: [
      {
        name: "Technical Member 01",
        role: "Technical Team",
        image: "/images/volunteers/technical01.jpg",
      },
      {
        name: "Technical Member 02",
        role: "Technical Team",
        image: "/images/volunteers/technical02.jpg",
      },
    ],
  },
  {
    title: "Designing & Social Media",
    subtitle: "Creative Design • Digital Outreach",
    icon: "✦",
    members: [
      {
        name: "Design Member 01",
        role: "Design & Social Media",
        image: "/images/volunteers/design01.jpg",
      },
      {
        name: "Design Member 02",
        role: "Design & Social Media",
        image: "/images/volunteers/design02.jpg",
      },
    ],
  },
];


function UnitCard({ unit, position }) {
  return (
    <article className={`unit-card ${unit.color} position-${position}`}>
      <div className="unit-content">

        <div className="unit-image-wrapper">
          <img
            src={unit.image}
            alt={`${unit.name} historical heritage`}
            className="unit-image"
          />
        </div>

        <h3>{unit.name}</h3>

        <p className="unit-importance">
          {unit.importance}
        </p>

        <div className="unit-details">

          <div className="detail-item">
            <span className="detail-icon">👥</span>

            <div>
              <span className="detail-label">
                Total Volunteers
              </span>

              <strong>{unit.volunteers}</strong>
            </div>
          </div>

          <div className="detail-divider"></div>

          <div className="detail-item">
            <span className="detail-icon">👤</span>

            <div>
              <span className="detail-label">
                Program Coordinator
              </span>

              <strong>{unit.coordinator}</strong>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
}

function Units() {
  const [apiUnits, setApiUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [unitsError, setUnitsError] = useState("");

  useEffect(() => {
    let isActive = true;

    fetch("/api/units")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load units: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (isActive) {
          setApiUnits(data);
        }
      })
      .catch((error) => {
        if (isActive) {
          setUnitsError(error.message);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoadingUnits(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);
  const displayedUnits = units.map((unit) => {
    const backendUnit = apiUnits.find(
      (item) =>
        item.unitName?.toUpperCase().replace(/[^A-Z0-9]/g, "") ===
        unit.name.toUpperCase().replace(/[^A-Z0-9]/g, "")
    );

    if (!backendUnit) return unit;

    return {
      ...unit,
      coordinator: backendUnit.coordinatorName || unit.coordinator,
      importance: backendUnit.description || unit.importance,
    };
  });  

return (
    <div className="units-page">
<Header />
      {/* ================= HERO ================= */}

      <section className="units-hero">
        <div className="hero-overlay"></div>

        <div className="units-hero-content">

          <span className="hero-line"></span>

          <h1>Our Units</h1>

          <p>
            Five units. One vision.
            <br />
            Different legacies, the same purpose — to serve,
            <br />
            to inspire, to build a better tomorrow.
          </p>

        </div>
      </section>


      {/* ================= UNITS SECTION ================= */}

     
    {/* ================= UNITS SECTION ================= */}

<section className="units-section">

  <div className="section-heading">

    <h2>Our 5 NSS Units</h2>

    <p>
      Rooted in history&nbsp; | &nbsp;
      United by service&nbsp; | &nbsp;
      Driven by change
    </p>

    <span className="heading-line"></span>

  </div>


  {/* ================= CIRCULAR UNIT AREA ================= */}

  <div className="units-circle">

    {/* Decorative rings */}
    <div className="outer-ring"></div>
    <div className="inner-ring"></div>


    {/* Connector dots */}
    <span className="connector-dot dot-1"></span>
    <span className="connector-dot dot-2"></span>
    <span className="connector-dot dot-3"></span>
    <span className="connector-dot dot-4"></span>
    <span className="connector-dot dot-5"></span>


    {/* ================= CENTER NSS EMBLEM ================= */}

    <div className="nss-center">

   

        <img
          src="/images/nss-emblem.png"
          alt="National Service Scheme Emblem"
          className="nss-emblem"
        />

      </div>

      
  


    {/* ================= FIVE NSS UNITS ================= */}

    {displayedUnits.map((unit, index) => (

      <UnitCard
        key={unit.name}
        unit={unit}
        position={index + 1}
      />

    ))}

  </div>

</section> 
     
     
     




      

      {/* ============================= */}
      {/* ============================= */}
      {/* Volunteer Team Section */}
      {/* ============================= */}

      <section className="volunteer-team-section">

        <div className="volunteer-heading">
          <span className="volunteer-small-title">
            NSS BASAR
          </span>

          <h2>Our Volunteer Team</h2>

          <p>
            Meet the dedicated team members who work together
            to lead, organise and support NSS activities.
          </p>

          <span className="volunteer-heading-line"></span>
        </div>


        {/* EXACTLY 18 TEAM MEMBERS */}
        <div className="volunteer-count">
          <span className="count-number">18</span>
          <span className="count-text">Team Members</span>
        </div>


        {/* Team Panels - kept in the required order */}
        <div className="team-panels">

          {teamPanels.map((panel) => (

            <section
              className={`team-panel team-panel-${panel.members.length} ${
                panel.title === "UR Panel" ? "ur-panel" : ""
              }`}
              key={panel.title}
            >

              <div className="panel-heading">

                <div className="panel-icon">
                  {panel.icon}
                </div>

                <div className="panel-heading-text">
                  <h3>{panel.title}</h3>
                  <p>{panel.subtitle}</p>
                </div>

                <span className="panel-count">
                  {panel.members.length}
                </span>

              </div>


              <div className="panel-line"></div>


              <div className="volunteer-grid">

                {panel.members.map((member, index) => (

                  <article
                    className="volunteer-card"
                    key={`${panel.title}-${member.name}`}
                  >

                    <div className="volunteer-image-wrapper">

                      <img
                        src={member.image}
                        alt={member.name}
                        className="volunteer-image"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/volunteers/default-volunteer.jpg";
                        }}
                      />

                      <span className="volunteer-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>


                    <div className="volunteer-info">

                      <h3>{member.name}</h3>

                      <p className="volunteer-role">
                        {member.role}
                      </p>

                      {member.unit && (
                        <span className="volunteer-unit">
                          {member.unit}
                        </span>
                      )}

                    </div>

                  </article>

                ))}

              </div>

            </section>

          ))}

        </div>

      </section>


      {/* Bottom Quote */}
      <section className="units-quote">
     

        <div className="quote-line"></div>

        <p>
          “Together we serve, together we grow,
          <br />
          for a better tomorrow.”
        </p>

        <div className="quote-line"></div>

      </section>
 <Footer />
    </div>
  );
}

export default Units;

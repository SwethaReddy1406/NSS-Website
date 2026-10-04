import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="website">
      <Header />

      <div className="main-layout">
        <Sidebar />

        <main className="content">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;

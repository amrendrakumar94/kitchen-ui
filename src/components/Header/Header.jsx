import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="fixed top-0 w-full bg-white z-50">
      <div>
        <nav className="upper-nav align-middle p-1">
          <h1 className="text-center">
            Delicious dishes await! Order now for a tasty experience
          </h1>
        </nav>
      </div>
      <nav className="p-4 mt-2  shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-28">
            <div className="">
              <a href="/" className="text-black font-bold text-xl">
                Kitchen
              </a>
            </div>
            <div className="hidden md:flex">
              <ul className="flex space-x-24">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `font-bold block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Menu
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/reservation"
                    className={({ isActive }) =>
                      `font-bold block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Reservation
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `font-bold block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Contact
                  </NavLink>
                </li>
                <li>
                  <input
                    type="text"
                    className="rounded-2xl border border-gray-300 shadow p-0.5 focus:outline-none focus:border-gray-300 max-w-48 text-center"
                    placeholder="Search menu item"
                  />
                </li>

                <li>
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      `font-bold block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Account
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `font-bold block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Cart
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;

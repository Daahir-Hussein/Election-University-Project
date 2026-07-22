function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-4 text-center text-sm text-gray-600 lg:px-6">
      <p>
        &copy; {year} Election Management System. National Election Portal.
      </p>
      {/* <p className="mt-1 text-xs text-gray-500">
        University Final Assessment Project — React &amp; ASP.NET Core Web API
      </p> */}
    </footer>
  );
}

export default Footer;

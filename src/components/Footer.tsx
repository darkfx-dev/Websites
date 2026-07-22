import { site } from "../content/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">{site.brand}</p>
          <p className="footer__line">{site.footer.line}</p>
        </div>
        <ul className="footer__links">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={site.github} rel="noopener noreferrer" target="_blank">
              GitHub
            </a>
          </li>
        </ul>
        <p className="footer__legal">
          © {new Date().getFullYear()} {site.brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

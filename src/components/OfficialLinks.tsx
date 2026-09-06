import { OFFICIAL_LINKS } from "../cluster";

export function OfficialLinks() {
  return (
    <section className="card" id="links">
      <div className="card-head">
        <div>
          <p className="eyebrow">Pantry</p>
          <h2>Official links</h2>
        </div>
      </div>
      <p className="lede">
        Cookie Chain destinations only. No token launch, pool, or swap links.
      </p>
      <ul className="link-grid">
        {OFFICIAL_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              <strong>{link.label}</strong>
              <span>{link.blurb}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

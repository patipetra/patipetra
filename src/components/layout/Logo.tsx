interface LogoProps {
  dark?: boolean;
  height?: number;
}

export default function Logo({ dark = false, height = 44 }: LogoProps) {
  return (
    <svg
      style={{ height, width: 'auto', display: 'block' }}
      viewBox="0 0 360 92"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Patıpetra"
    >
      <text
        x="10" y="62"
        fontFamily="'Playfair Display',Georgia,serif"
        fontSize="50" fontWeight="600"
        fill={dark ? '#FDFBF7' : '#2F2622'}
        letterSpacing="1"
      >Patı</text>
      <g transform="translate(77,10)" fill="#C9832E">
        <circle cx="7"  cy="14" r="2.2" />
        <circle cx="12" cy="9"  r="2.2" />
        <circle cx="18" cy="13" r="2.2" />
        <ellipse cx="13" cy="19" rx="4.6" ry="4" />
      </g>
      <text
        x="100" y="62"
        fontFamily="'Cormorant Garamond','Times New Roman',serif"
        fontSize="50" fontStyle="italic" fontWeight="600"
        fill="#C9832E" letterSpacing="-0.2"
      >petra</text>
    </svg>
  );
}

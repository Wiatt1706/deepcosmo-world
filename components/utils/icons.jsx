import React from "react";
export const ChevronDownIcon = () => (
  <svg
    fill="none"
    height="14"
    viewBox="0 0 24 24"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
      fill="currentColor"
    />
  </svg>
);

export const ChevronDown = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const Lock = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  const color = fill;

  return (
    <svg
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(3.5 2)">
        <path
          d="M9.121,6.653V4.5A4.561,4.561,0,0,0,0,4.484V6.653"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth={1.5}
          transform="translate(3.85 0.75)"
        />
        <path
          d="M.5,0V2.221"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth={1.5}
          transform="translate(7.91 12.156)"
        />
        <path
          d="M7.66,0C1.915,0,0,1.568,0,6.271s1.915,6.272,7.66,6.272,7.661-1.568,7.661-6.272S13.4,0,7.66,0Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth={1.5}
          transform="translate(0.75 6.824)"
        />
      </g>
    </svg>
  );
};

export const Activity = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path d="M6.918 14.854l2.993-3.889 3.414 2.68 2.929-3.78" />
        <path d="M19.668 2.35a1.922 1.922 0 11-1.922 1.922 1.921 1.921 0 011.922-1.922z" />
        <path d="M20.756 9.269a20.809 20.809 0 01.194 3.034c0 6.938-2.312 9.25-9.25 9.25s-9.25-2.312-9.25-9.25 2.313-9.25 9.25-9.25a20.931 20.931 0 012.983.187" />
      </g>
    </svg>
  );
};

export const Flash = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.09 13.28h3.09v7.2c0 1.68.91 2.02 2.02.76l7.57-8.6c.93-1.05.54-1.92-.87-1.92h-3.09v-7.2c0-1.68-.91-2.02-2.02-.76l-7.57 8.6c-.92 1.06-.53 1.92.87 1.92Z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const Server = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.32 10H4.69c-1.48 0-2.68-1.21-2.68-2.68V4.69c0-1.48 1.21-2.68 2.68-2.68h14.63C20.8 2.01 22 3.22 22 4.69v2.63C22 8.79 20.79 10 19.32 10ZM19.32 22H4.69c-1.48 0-2.68-1.21-2.68-2.68v-2.63c0-1.48 1.21-2.68 2.68-2.68h14.63c1.48 0 2.68 1.21 2.68 2.68v2.63c0 1.47-1.21 2.68-2.68 2.68ZM6 5v2M10 5v2M6 17v2M10 17v2M14 6h4M14 18h4"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const TagUser = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 18.86h-.76c-.8 0-1.56.31-2.12.87l-1.71 1.69c-.78.77-2.05.77-2.83 0l-1.71-1.69c-.56-.56-1.33-.87-2.12-.87H6c-1.66 0-3-1.33-3-2.97V4.98c0-1.64 1.34-2.97 3-2.97h12c1.66 0 3 1.33 3 2.97v10.91c0 1.63-1.34 2.97-3 2.97Z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M12 10a2.33 2.33 0 1 0 0-4.66A2.33 2.33 0 0 0 12 10ZM16 15.66c0-1.8-1.79-3.26-4-3.26s-4 1.46-4 3.26"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const Scale = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      height={size || height}
      width={size || width}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M18 10V6h-4M6 14v4h4"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const LogoSvg = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      {...props}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5V37L13 29L21 21M5 5C5 5 9.87581 9.87581 13 13M5 5L13 13M37 5C37 5 32.1242 9.87581 29 13M37 37C33.8758 33.8758 29 29 29 29C29 29 24.1242 24.1242 21 21M21 21C17.8758 17.8758 16.1242 16.1242 13 13M21 21L13 13"
        stroke="#0070F0"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
export const PlaySvg = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
      />
    </svg>
  );
};

export const ImportModelSvg = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      {...props}
      viewBox="0 0 83 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_223_382)">
        <path
          d="M41.5 72.625L13.8333 57.0625V25.9375L41.5 10.375L69.1667 25.9375V41.5"
          stroke="#A1A1AA"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M41.5 41.5L69.1667 25.9375"
          stroke="#A1A1AA"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M41.5 41.5V72.625"
          stroke="#A1A1AA"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M41.5 41.5L13.8333 25.9375"
          stroke="#A1A1AA"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M76.0833 62.25H51.875"
          stroke="#A1A1AA"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M62.25 51.875L51.875 62.25L62.25 72.625"
          stroke="#A1A1AA"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_223_382">
          <rect width="83" height="83" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const StoreSvg = ({
  fill = "currentColor",
  size = null,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      {...props}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_227_384)">
        <g filter="url(#filter0_d_227_384)">
          <path
            d="M26.6966 94.9627V224.993C26.6966 229.421 30.2878 233.012 34.7163 233.012H221C225.428 233.012 229.019 229.421 229.019 224.993V94.9627V57.5869C229.019 53.1583 225.428 49.5671 221 49.5671H34.7163C30.2878 49.5699 26.6966 53.1583 26.6966 57.5869V94.9627Z"
            fill="#40596B"
          />
          <path
            d="M196.238 122.588H154.897C151.593 122.588 148.912 125.269 148.912 128.573V222.166H202.223V128.573C202.223 125.269 199.543 122.588 196.238 122.588Z"
            fill="#D6E0EB"
          />
          <path
            d="M117.749 192.551H59.1943C56.0443 192.551 53.49 189.997 53.49 186.847V128.292C53.49 125.142 56.0443 122.588 59.1943 122.588H117.752C120.902 122.588 123.456 125.142 123.456 128.292V186.85C123.453 190 120.899 192.551 117.749 192.551Z"
            fill="#D6E0EB"
          />
          <path
            d="M27.2586 94.9628H26.1346C12.478 94.9628 1.40662 83.8914 1.40662 70.2348V61.6531C16.8082 56.4799 33.5305 55.9881 51.9866 61.6531V70.2348C51.9866 83.8914 40.9152 94.9628 27.2586 94.9628Z"
            fill="#E74E3A"
          />
          <path
            d="M77.8386 94.9629H76.7146C63.058 94.9629 51.9866 83.8915 51.9866 70.2349V61.6531C69.9369 57.9973 86.9065 57.6264 102.567 61.6531V70.2349C102.567 83.8915 91.4952 94.9629 77.8386 94.9629Z"
            fill="#B0B6BC"
          />
          <path
            d="M228.455 94.9628H229.579C243.235 94.9628 254.307 83.8914 254.307 70.2348V61.653C238.602 57.4858 221.565 58.1321 203.727 61.653V70.2348C203.727 83.8914 214.798 94.9628 228.455 94.9628Z"
            fill="#E74E3A"
          />
          <path
            d="M177.875 94.9627H178.999C192.655 94.9627 203.727 83.8913 203.727 70.2347V61.6529C186.867 54.465 170.007 54.465 153.147 61.6529V70.2347C153.147 83.8913 164.218 94.9627 177.875 94.9627Z"
            fill="#B0B6BC"
          />
          <path
            d="M102.567 61.653C105.177 50.4636 104.986 37.3493 102.567 22.7036H66.6689C57.025 35.6858 52.1328 48.6708 51.9866 61.653H102.567Z"
            fill="#D6E0EB"
          />
          <path
            d="M1.40662 61.6531L33.4125 22.7065H66.6829L51.9866 61.6531H1.40662Z"
            fill="#FF7058"
          />
          <path
            d="M153.147 61.653C147.057 49.0389 147.945 36.0033 153.147 22.7036H189.044C201.026 37.2847 206.52 50.4046 203.727 61.653H153.147Z"
            fill="#D6E0EB"
          />
          <path
            d="M254.307 61.6531L222.301 22.7065H189.058L203.727 61.6531H254.307Z"
            fill="#FF7058"
          />
          <path
            d="M128.419 94.9627H127.295C113.638 94.9627 102.567 83.8913 102.567 70.2347V61.6529C119.427 54.465 136.287 54.465 153.147 61.6529V70.2347C153.147 83.8913 142.075 94.9627 128.419 94.9627Z"
            fill="#E74E3A"
          />
          <path
            d="M102.567 22.7065H132.83H153.147V61.6531H102.567V22.7065Z"
            fill="#FF7058"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_227_384"
          x="-8.59338"
          y="16.7036"
          width="272.9"
          height="230.309"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_227_384"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_227_384"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_227_384">
          <rect width="256" height="256" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const GithubSvg = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      {...props}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.7001 0.599976C6.07349 0.599976 0.699997 5.95069 0.699997 12.5514C0.699997 17.8319 4.13839 22.3118 8.9064 23.8921C9.50612 24.0027 9.7263 23.6328 9.7263 23.3172C9.7263 23.0322 9.71517 22.0907 9.71001 21.0921C6.37157 21.815 5.66712 19.6819 5.66712 19.6819C5.12124 18.3005 4.33472 17.9332 4.33472 17.9332C3.24595 17.1914 4.41679 17.2067 4.41679 17.2067C5.62181 17.291 6.25631 18.4383 6.25631 18.4383C7.3266 20.2654 9.06358 19.7372 9.74836 19.4318C9.85606 18.6593 10.1671 18.1321 10.5102 17.8337C7.84485 17.5314 5.04295 16.5067 5.04295 11.9272C5.04295 10.6224 5.51172 9.55623 6.27936 8.71927C6.15477 8.41825 5.74402 7.20268 6.39561 5.55645C6.39561 5.55645 7.4033 5.23525 9.69649 6.78152C10.6537 6.51672 11.6803 6.38392 12.7001 6.37937C13.7199 6.38392 14.7473 6.51672 15.7063 6.78152C17.9967 5.23525 19.003 5.55645 19.003 5.55645C19.6562 7.20268 19.2452 8.41825 19.1206 8.71927C19.8901 9.55623 20.3557 10.6224 20.3557 11.9272C20.3557 16.5176 17.5484 17.5283 14.8762 17.8242C15.3067 18.195 15.6902 18.9224 15.6902 20.0374C15.6902 21.6365 15.6763 22.9235 15.6763 23.3172C15.6763 23.6352 15.8923 24.0079 16.5006 23.8905C21.266 22.3084 24.7 17.8301 24.7 12.5514C24.7 5.95069 19.3273 0.599976 12.7001 0.599976ZM5.19442 17.6251C5.16799 17.6844 5.0742 17.7022 4.98875 17.6615C4.90171 17.6225 4.85283 17.5415 4.88105 17.482C4.90688 17.4208 5.00087 17.4038 5.08771 17.4448C5.17495 17.4837 5.22463 17.5655 5.19442 17.6251ZM5.7847 18.1496C5.72747 18.2025 5.61559 18.1779 5.53968 18.0944C5.46119 18.0111 5.44648 17.8997 5.50451 17.846C5.56352 17.7932 5.67202 17.8179 5.75072 17.9012C5.82921 17.9855 5.84451 18.0962 5.7847 18.1496ZM6.18964 18.8208C6.11612 18.8716 5.9959 18.8239 5.92158 18.7176C5.84805 18.6114 5.84805 18.4839 5.92317 18.4329C5.99768 18.3818 6.11612 18.4277 6.19143 18.5332C6.26476 18.6413 6.26476 18.7687 6.18964 18.8208ZM6.8745 19.598C6.80872 19.6703 6.66863 19.6509 6.56609 19.5523C6.46117 19.4559 6.43196 19.3192 6.49793 19.247C6.5645 19.1745 6.70539 19.1949 6.80872 19.2927C6.91285 19.3889 6.94465 19.5266 6.8745 19.598ZM7.75961 19.8605C7.7306 19.9541 7.59567 19.9966 7.45974 19.9568C7.32402 19.9159 7.2352 19.8062 7.26262 19.7116C7.29084 19.6174 7.42636 19.5731 7.56328 19.6156C7.6988 19.6564 7.78783 19.7653 7.75961 19.8605ZM8.7669 19.9718C8.77028 20.0703 8.65502 20.1521 8.51234 20.1538C8.36887 20.157 8.25282 20.0772 8.25123 19.9803C8.25123 19.8807 8.3639 19.7998 8.50737 19.7974C8.65005 19.7946 8.7669 19.8738 8.7669 19.9718ZM9.75645 19.934C9.77354 20.0302 9.67438 20.1289 9.53269 20.1552C9.39339 20.1806 9.26443 20.1212 9.24674 20.0258C9.22945 19.9273 9.3304 19.8285 9.4695 19.803C9.61139 19.7784 9.73837 19.8362 9.75645 19.934Z"
        fill="white"
      ></path>
    </svg>
  );
};
export const GoogleSvg = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg width="24" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.8 12.5a8.628 8.628 0 0 0-.212-2.05H12.2v3.723h5.51a4.913 4.913 0 0 1-2.044 3.255l-.019.125 2.969 2.307.205.02c1.889-1.75 2.978-4.325 2.978-7.38"
        fill="#4285F4"
      ></path>
      <path
        d="M12.2 22.31c2.7 0 4.966-.891 6.622-2.43l-3.156-2.452c-.844.59-1.978 1.003-3.466 1.003a6.006 6.006 0 0 1-3.516-1.162 6.039 6.039 0 0 1-2.173-3.007l-.117.01-3.087 2.397-.04.112a10.013 10.013 0 0 0 3.684 4.037A9.966 9.966 0 0 0 12.2 22.31"
        fill="#34A853"
      ></path>
      <path
        d="M6.51 14.26a6.196 6.196 0 0 1-.333-1.985 6.51 6.51 0 0 1 .322-1.984l-.006-.133L3.37 7.723l-.102.048a10.04 10.04 0 0 0 0 9.008l3.244-2.52Z"
        fill="#FBBC05"
      ></path>
      <path
        d="M12.2 6.123a5.532 5.532 0 0 1 3.866 1.493l2.823-2.764a9.59 9.59 0 0 0-6.69-2.61c-1.853 0-3.67.517-5.248 1.494a10.014 10.014 0 0 0-3.685 4.036l3.234 2.52a6.064 6.064 0 0 1 2.18-3.005 6.031 6.031 0 0 1 3.52-1.164Z"
        fill="#EB4335"
      ></path>
    </svg>
  );
};

export const SecuritySvg = ({
  fill = "#0070f0",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      {...props}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6453 7.03281C16.3508 6.725 16.0461 6.40781 15.9312 6.12891C15.825 5.87344 15.8187 5.45 15.8125 5.03984C15.8008 4.27734 15.7883 3.41328 15.1875 2.8125C14.5867 2.21172 13.7227 2.19922 12.9602 2.1875C12.55 2.18125 12.1266 2.175 11.8711 2.06875C11.593 1.95391 11.275 1.64922 10.9672 1.35469C10.4281 0.836719 9.81563 0.25 9 0.25C8.18437 0.25 7.57266 0.836719 7.03281 1.35469C6.725 1.64922 6.40781 1.95391 6.12891 2.06875C5.875 2.175 5.45 2.18125 5.03984 2.1875C4.27734 2.19922 3.41328 2.21172 2.8125 2.8125C2.21172 3.41328 2.20312 4.27734 2.1875 5.03984C2.18125 5.45 2.175 5.87344 2.06875 6.12891C1.95391 6.40703 1.64922 6.725 1.35469 7.03281C0.836719 7.57188 0.25 8.18437 0.25 9C0.25 9.81563 0.836719 10.4273 1.35469 10.9672C1.64922 11.275 1.95391 11.5922 2.06875 11.8711C2.175 12.1266 2.18125 12.55 2.1875 12.9602C2.19922 13.7227 2.21172 14.5867 2.8125 15.1875C3.41328 15.7883 4.27734 15.8008 5.03984 15.8125C5.45 15.8187 5.87344 15.825 6.12891 15.9312C6.40703 16.0461 6.725 16.3508 7.03281 16.6453C7.57188 17.1633 8.18437 17.75 9 17.75C9.81563 17.75 10.4273 17.1633 10.9672 16.6453C11.275 16.3508 11.5922 16.0461 11.8711 15.9312C12.1266 15.825 12.55 15.8187 12.9602 15.8125C13.7227 15.8008 14.5867 15.7883 15.1875 15.1875C15.7883 14.5867 15.8008 13.7227 15.8125 12.9602C15.8187 12.55 15.825 12.1266 15.9312 11.8711C16.0461 11.593 16.3508 11.275 16.6453 10.9672C17.1633 10.4281 17.75 9.81563 17.75 9C17.75 8.18437 17.1633 7.57266 16.6453 7.03281ZM12.5672 7.56719L8.19219 11.9422C8.13414 12.0003 8.06521 12.0464 7.98934 12.0779C7.91346 12.1093 7.83213 12.1255 7.75 12.1255C7.66787 12.1255 7.58654 12.1093 7.51066 12.0779C7.43479 12.0464 7.36586 12.0003 7.30781 11.9422L5.43281 10.0672C5.31554 9.94991 5.24965 9.79085 5.24965 9.625C5.24965 9.45915 5.31554 9.30009 5.43281 9.18281C5.55009 9.06554 5.70915 8.99965 5.875 8.99965C6.04085 8.99965 6.19991 9.06554 6.31719 9.18281L7.75 10.6164L11.6828 6.68281C11.7409 6.62474 11.8098 6.57868 11.8857 6.54725C11.9616 6.51583 12.0429 6.49965 12.125 6.49965C12.2071 6.49965 12.2884 6.51583 12.3643 6.54725C12.4402 6.57868 12.5091 6.62474 12.5672 6.68281C12.6253 6.74088 12.6713 6.80982 12.7027 6.88569C12.7342 6.96156 12.7503 7.04288 12.7503 7.125C12.7503 7.20712 12.7342 7.28844 12.7027 7.36431C12.6713 7.44018 12.6253 7.50912 12.5672 7.56719Z"
        fill={fill}
      />
    </svg>
  );
};

export const GeminiSVG = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 468 468"
    >
      <path
        d="M410.606 210.128C300.476 216.914 212.347 306.938 205.705 419.436H204.901C198.258 306.938 110.13 216.914 0 210.128V209.307C110.13 202.522 198.258 112.498 204.901 0H205.705C212.347 112.498 300.476 202.522 410.606 209.307V210.128Z"
        fill="url(#paint0_radial_0_1)"
      />
      <path
        d="M468.001 384.594C423.171 387.298 387.297 423.173 384.593 468.003H384.266C381.562 423.173 345.688 387.298 300.859 384.594V384.267C345.688 381.563 381.562 345.689 384.266 300.858H384.593C387.297 345.689 423.171 381.563 468.001 384.267V384.594Z"
        fill="url(#paint1_radial_0_1)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_0_1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-126 209.192) scale(444 3619.89)"
        >
          <stop offset="0.385135" stop-color="#9E72BA" />
          <stop offset="0.734299" stop-color="#D65C67" />
          <stop offset="0.931035" stop-color="#D6635C" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_0_1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(249.569 384.221) scale(180.736 1442.52)"
        >
          <stop offset="0.385135" stop-color="#9E72BA" />
          <stop offset="0.734299" stop-color="#D65C67" />
          <stop offset="0.931035" stop-color="#D6635C" />
        </radialGradient>
      </defs>
    </svg>
  );
};

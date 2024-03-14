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

export const ChevronDown = ({ fill, size, height, width, ...props }) => {
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

export const Lock = ({ fill, size, height, width, ...props }) => {
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

export const Activity = ({ fill, size, height, width, ...props }) => {
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
  size,
  height,
  width,
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
  size,
  height,
  width,
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
  size,
  height,
  width,
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
  size,
  height,
  width,
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
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      {...props}
      viewBox="0 0 392 392"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_bd_139_385)">
        <path
          d="M46 42V342L196 192M46 42C46 42 91.7107 87.7107 121 117M46 42L121 117M346 42C346 42 300.289 87.7107 271 117M346 342C316.711 312.711 271 267 271 267C271 267 225.289 221.289 196 192M196 192C166.711 162.711 150.289 146.289 121 117M196 192L121 117"
          stroke="#0070F0"
          stroke-width="84"
          stroke-linecap="round"
          stroke-linejoin="round"
          shape-rendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_bd_139_385"
          x="0"
          y="-4.00122"
          width="392"
          height="396.002"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_139_385"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_backgroundBlur_139_385"
            result="effect2_dropShadow_139_385"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_139_385"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
export const PlaySvg = ({
  fill = "currentColor",
  size,
  height,
  width,
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
  size,
  height,
  width,
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
  size,
  height,
  width,
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

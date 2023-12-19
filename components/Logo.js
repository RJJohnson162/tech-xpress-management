import Link from "next/link";

export default function Logo() {
    return (
        <Link href={"/"} className="flex items-center justify-center">
            <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-12 h-12 text-green-400 font-extrabold"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </>

            <span className="text-violet-100"><b>-press Admin-Management</b></span>
        </Link>
    );
}

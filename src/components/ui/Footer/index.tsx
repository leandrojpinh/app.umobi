'use client';

import { animateScroll as scroll } from "react-scroll";
import { FiInstagram, FiFacebook, FiArrowUp } from "react-icons/fi";

import { RESOURCES } from '@/constants/Resources';
import Image from "next/image";
import Link from "next/link";
import { logoUmobi } from "@/assets";

export const Footer = () => {
	return (
		<footer className={`border-t-2 border-solid border-app-black-light py-0 px-4 justify-center flex`}>
			<div className="max-w-7xl w-full flex flex-col py-8 md:flex-row">
				<div className="flex flex-col p-0">
					<picture className="cursor-pointer" onClick={() => scroll.scrollToTop()}>
						<Image src={logoUmobi} alt="Umobi" />
					</picture>
					<span className="mt-4 font-app-text">© Todos os direitos reservados - {new Date().getFullYear()}</span>
				</div>
				<div className="flex justify-start mt-8 md:mt-0 md:ml-auto md:items-end">
					<Link
						className="cursor-pointer text-text bg-app-black-light flex items-center justify-center p-4 border-none rounded-lg transition-all hover:brightness-90"
						href={RESOURCES.instagram} target="_blank" rel="noreferrer">
						<FiInstagram size={18} />
					</Link>
					<Link className="cursor-pointer text-text bg-app-black-light flex items-center justify-center p-4 border-none rounded-lg transition-all ml-4 hover:brightness-90"
						href={RESOURCES.facebook} target="_blank" rel="noreferrer">
						<FiFacebook size={18} />
					</Link>
					<button
						className="cursor-pointer text-text bg-app-black-light flex items-center justify-center p-4 border-none rounded-lg transition-all hover:brightness-90 ml-auto md:ml-4"
						onClick={() => scroll.scrollToTop()}>
						<FiArrowUp size={18} />
					</button>
				</div>
			</div>
		</footer>
	)
}
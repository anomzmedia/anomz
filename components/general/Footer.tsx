import { ArrowRight, Github, MoveRight } from "lucide-react";
import Button from "../ui/Button";

export default function Footer() {
    return (
        <footer>
            <div className="mx-auto grid max-w-7xl grid-cols-6 gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-16 md:py-24">
                <div className="col-span-full flex flex-col items-start gap-4 lg:col-span-2">
                    <a href="#">
                        <div className="flex items-center gap-3">
                            {/*icon*/}
                            <span className="text-xl font-semibold">E-Commerce</span>
                        </div>
                    </a>

                    <p className="text-muted-foreground">
                        An open-source e-commerce website. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, voluptates asperiores, exercitationem facilis, aperiam sed iste ipsum minima impedit nobis aliquam repellat corrupti iure voluptatum maxime magni? Voluptatum, explicabo sequi.
                    </p>

                    <div className="bg-border h-px w-35" />

                    <div className="flex items-center gap-4">
                        <a href="https://github.com/arasemr12/" target="_blank" rel="noopener noreferrer">
                            <Github />
                        </a>
                    </div>
                </div>

                <div className="col-span-full grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-4 lg:gap-8">
                    <div className="flex flex-col gap-5">
                        <div className="text-lg font-medium">Company</div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li><a href="#">About</a></li>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Works</a></li>
                            <li><a href="#">Career</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="text-lg font-medium">Help</div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li><a href="#">Customer Support</a></li>
                            <li><a href="#">Delivery Details</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="col-span-full flex flex-col gap-5 sm:col-span-2">
                        <p className="text-lg font-medium">Subscribe to newsletter</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Your email..."/>
                            <Button>
                                <ArrowRight/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-border h-px w-full" />

            <div className="mx-auto flex max-w-7xl justify-center px-4 py-6 sm:px-6">
                <p className="text-center font-medium">
                    ©{new Date().getFullYear()} <a href="https://github.com/arasemr12/">arasemr1234</a>, Made with ❤️
                </p>
            </div>
        </footer>
    );
}

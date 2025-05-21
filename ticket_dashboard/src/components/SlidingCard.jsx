import * as React from "react"
import { FaTicket, FaTicketSimple, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { PiFoldersFill, PiUserCirclePlusDuotone } from "react-icons/pi";
import { BsStopCircleFill, BsQuestionOctagonFill } from "react-icons/bs";
import { Card, CardContent } from "@/components/ui/card"
import Cards from "./Cards";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselSpacing({ ticketInfo, onClick, activeCard }) {
    return (
        <Carousel className="w-3/4">
            <CarouselContent className="-ml-1">
                {ticketInfo.map((category, index) => (
                    <CarouselItem key={index} className="pl-1">
                        <div className="p-1">
                            
                            <Cards className={`cursor-pointer flex  ${activeCard === category.ticket_status ? "bg-[rgb(177,216,216)]" : "bg-white"}`}
                                onClick={() => onClick(category.ticket_status)}
                                ticketInfo={category}/>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

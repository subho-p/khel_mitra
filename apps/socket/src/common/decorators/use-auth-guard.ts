import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../guards";

export const UseAuthGuard = () => UseGuards(JwtGuard);
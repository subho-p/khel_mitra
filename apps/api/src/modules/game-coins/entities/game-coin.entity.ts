import { ApiProperty } from "@nestjs/swagger";

export class GameCoin {
  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  coins: number;

  @ApiProperty({ required: false })
  imageUrl?: string | null;
}

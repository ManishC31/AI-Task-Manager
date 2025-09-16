import { NextResponse } from "next/server";

export const SendResponse = (code: number, message: string | null, data?: any) => {
  return NextResponse.json(
    {
      success: code < 399 ? true : false,
      message: message,
      data: data,
    },
    { status: code }
  );
};

import OperatorService from "@/src/domain/services/operators/OperatorService";
import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { NextRequest, NextResponse } from "next/server";
import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";

export async function POST(req: NextRequest) {
  const operatorService = container.resolve(OperatorService);
  try {
    const data: CreateOperatorDTO = await req.json();
    const operator = await operatorService.create(data);
    return NextResponse.json(operator.email, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create task.' }, { status: 500 });
  }
}

import { TicketService } from "../application/ticket.service";
import { TicketRepository } from "../repository/ticket.repository";
import { SafeUserEntity } from "../../auth/domain/auth.entity";
import { ApiError } from "../../../utils/api.error";
import {
  CreateTicket,
  EscalateTicket,
  AssignCritical,
  CloseTicket,
  UpdateTicketStatus,
  TicketQuery
} from "../dto/ticket.request.dto";
import { TicketEntity } from "../domain/ticket.entity";

const mockRepo: jest.Mocked<TicketRepository> = {
  getBoards: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
};

const service = new TicketService(mockRepo);

const user: SafeUserEntity = {
  _id: "user1",
  name: "User",
  email: "test@example.com",
  role: "L1"
};

const now = new Date();

const baseTicket: TicketEntity = {
  _id: "1",
  title: "Issue",
  description: "System down",
  category: "IT",
  expectedCompletion: now,
  priority: "High",
  status: "New",
  escalationLevel: 0,
  createdBy: user,
  assignedTo: user,
  logs: [],
  createdAt: now,
  updatedAt: now
};

describe("TicketService Unit Tests", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should group tickets for L1 user", async () => {
    const query: TicketQuery = { status: 'New', priority: 'Medium' }
    mockRepo.getBoards.mockResolvedValueOnce([baseTicket]);

    const result = await service.getBoards(query, user);
    expect(result["New"]).toHaveLength(1);
    expect(result["New"][0].title).toBe("Issue");
  });

  it("should create a new ticket", async () => {
    const createInput: CreateTicket = {
      title: "Issue",
      description: "System down",
      priority: "High",
      category: "IT",
      expectedCompletion: now.toISOString()
    };

    const createdTicket: TicketEntity = {
      ...baseTicket,
      title: createInput.title,
      description: createInput.description,
      priority: createInput.priority,
      category: createInput.category,
      expectedCompletion: now
    };

    mockRepo.create.mockResolvedValueOnce(createdTicket);

    const result = await service.create(createInput, user);
    expect(result.title).toBe("Issue");
    expect(result.status).toBe("New");
  });

  it("should update status with log", async () => {
    mockRepo.findById.mockResolvedValueOnce(baseTicket);

    const updatedTicket: TicketEntity = {
      ...baseTicket,
      status: "Completed"
    };

    mockRepo.update.mockResolvedValueOnce(updatedTicket);

    const input: UpdateTicketStatus = { status: "Completed" };
    const result = await service.updateStatus("1", input, user);
    expect(result.status).toBe("Completed");
  });

  it("should escalate ticket to L2", async () => {
    mockRepo.findById.mockResolvedValueOnce(baseTicket);

    const escalated: TicketEntity = {
      ...baseTicket,
      status: "Escalated",
      escalationLevel: 1
    };

    mockRepo.update.mockResolvedValueOnce(escalated);

    const input: EscalateTicket = {
      toLevel: 1,
      note: "Up escalated"
    };

    const result = await service.escalate("1", input, user);
    expect(result.status).toBe("Escalated");
    expect(result.escalationLevel).toBe(1);
  });

  it("should assign critical level", async () => {
    mockRepo.findById.mockResolvedValueOnce(baseTicket);

    const updated: TicketEntity = {
      ...baseTicket,
      criticalLevel: "C1"
    };

    mockRepo.update.mockResolvedValueOnce(updated);

    const input: AssignCritical = {
      note: "Urgent",
      level: "C1"
    };

    const result = await service.criticalValues("1", input, user);
    expect(result.criticalLevel).toBe("C1");
  });

  it("should close ticket with resolution", async () => {
    mockRepo.findById.mockResolvedValueOnce(baseTicket);

    const closed: TicketEntity = {
      ...baseTicket,
      status: "Completed",
      resolution: "Issue resolved",
      closedAt: now
    };

    mockRepo.update.mockResolvedValueOnce(closed);

    const input: CloseTicket = {
      resolution: "Issue resolved"
    };

    const result = await service.closeTicket("1", input, user);
    expect(result.status).toBe("Completed");
    expect(result.resolution).toBe("Issue resolved");
  });

  it("should throw error if ticket not found on updateStatus", async () => {
    mockRepo.findById.mockResolvedValueOnce(null);
    const input: UpdateTicketStatus = { status: "Completed" };

    await expect(service.updateStatus("404", input, user)).rejects.toThrow(ApiError);
  });
});

import request from "supertest";
import { createTestApp } from "../../../__tests__/utils/app";
import httpStatus from "http-status";
import { SafeUserEntity } from "../../auth/domain/auth.entity";
import type { Request, Response, NextFunction } from "express";

jest.mock("../../../constants/roles", () => ({
  L1: "L1",
  L2: "L2",
  L3: "L3"
}));
const mockRepo = {};

jest.mock("../repository/ticket.repository", () => ({
  TicketRepository: jest.fn().mockImplementation(() => mockRepo)
}));
const mockService = {
  getBoards: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
  escalate: jest.fn(),
  criticalValues: jest.fn(),
  closeTicket: jest.fn(),
};
jest.mock("../application/ticket.service", () => ({
  TicketService: jest.fn().mockImplementation(() => mockService)
}));
const mockController = {
  getAll: jest.fn(),
  createTicket: jest.fn(),
  updateStatusTicket: jest.fn(),
  escalate: jest.fn(),
  criticalValue: jest.fn(),
  closeTicket: jest.fn(),
};
jest.mock("../interfaces/ticket.controller", () => ({
  TicketController: jest.fn().mockImplementation(() => mockController)
}));
jest.mock("../../../middleware/async", () => ({
  asyncHandler: (fn: void) => fn
}));

jest.mock("../../../middleware/auth", () => ({
  authenticate: (req: Request, res: NextFunction, next: NextFunction) => next(),
  authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ code: 403, message: "Forbidden" });
    }
    next();
  }
}));
jest.mock("../../../middleware/validate", () => ({
  validate: () => (req: Request, res: Response, next: NextFunction) => next()
}));
import ticketRouter from "../interfaces/ticket.routes";
const user: SafeUserEntity = {
  _id: "user1",
  name: "Helpdesk Agent",
  email: "l1@example.com",
  role: "L1",
};

describe("TicketController Routes", () => {
  let app: any;
  beforeEach(() => {
    jest.clearAllMocks();
    mockController.getAll.mockImplementation((req, res) => {
      res.status(200).json({
        code: 200,
        message: "Success",
        data: { New: [] }
      });
    });
    mockController.createTicket.mockImplementation((req, res) => {
      res.status(httpStatus.CREATED).json({
        code: httpStatus.CREATED,
        message: "Ticket created",
        data: { title: req.body.title }
      });
    });
    mockController.updateStatusTicket.mockImplementation((req, res) => {
      res.status(200).json({
        code: 200,
        message: "Status updated",
        data: { status: req.body.status }
      });
    });
    mockController.escalate.mockImplementation((req, res) => {
      res.status(200).json({
        code: 200,
        message: "Ticket escalated",
        data: { escalationLevel: req.body.toLevel }
      });
    });
    mockController.criticalValue.mockImplementation((req, res) => {
      res.status(200).json({
        code: 200,
        message: "Critical level assigned",
        data: { criticalLevel: req.body.level }
      });
    });
    mockController.closeTicket.mockImplementation((req, res) => {
      res.status(200).json({
        code: 200,
        message: "Ticket closed",
        data: {
          status: "Completed",
          resolution: req.body.resolution
        }
      });
    });
    app = createTestApp(ticketRouter, user, "/api/v1/ticket");
  });

  describe("L1 Role Tests", () => {
    it("should get all boards", async () => {
      const res = await request(app).get("/api/v1/ticket/boards");
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data).toHaveProperty("New");
      expect(mockController.getAll).toHaveBeenCalled();
    });
    it("should create ticket with L1 role", async () => {
      const res = await request(app)
        .post("/api/v1/ticket")
        .send({
          title: "Test Ticket",
          description: "Description",
          category: "IT",
          priority: "High",
          expectedCompletion: new Date().toISOString(),
        });
      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body.data.title).toBe("Test Ticket");
      expect(mockController.createTicket).toHaveBeenCalled();
    });
    it("should update ticket status with L1 role", async () => {
      const res = await request(app)
        .put("/api/v1/ticket/1/status")
        .send({ status: "Completed" });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("Completed");
      expect(mockController.updateStatusTicket).toHaveBeenCalled();
    });
    it("should escalate ticket with L1 role", async () => {
      const res = await request(app)
        .put("/api/v1/ticket/1/escalate")
        .send({ toLevel: 1, note: "Need support" });
      expect(res.status).toBe(200);
      expect(res.body.data.escalationLevel).toBe(1);
      expect(mockController.escalate).toHaveBeenCalled();
    });
    it("should NOT assign critical value with L1 role", async () => {
      const res = await request(app)
        .put("/api/v1/ticket/1/critical-value")
        .send({ level: "C1", note: "Urgent" });
      expect(res.status).toBe(403);
      expect(mockController.criticalValue).not.toHaveBeenCalled();
    });
    it("should NOT close ticket with L1 role", async () => {
      const res = await request(app)
        .put("/api/v1/ticket/1/close-ticket")
        .send({ resolution: "Fixed" });
      expect(res.status).toBe(403);
      expect(mockController.closeTicket).not.toHaveBeenCalled();
    });
  });
  describe("L2 Role Tests", () => {
    let l2App: any;
    beforeEach(() => {
      const l2User: SafeUserEntity = {
        _id: "user2",
        name: "Technical Support",
        email: "l2@example.com",
        role: "L2",
      };
      l2App = createTestApp(ticketRouter, l2User, "/api/v1/ticket");
    });

    it("should assign critical value with L2 role", async () => {
      const res = await request(l2App)
        .put("/api/v1/ticket/1/critical-value")
        .send({ level: "C1", note: "Urgent" });

      expect(res.status).toBe(200);
      expect(res.body.data.criticalLevel).toBe("C1");
      expect(mockController.criticalValue).toHaveBeenCalled();
    });
    it("should escalate ticket with L2 role", async () => {
      const res = await request(l2App)
        .put("/api/v1/ticket/1/escalate")
        .send({ toLevel: 2, note: "Need advanced support" });

      expect(res.status).toBe(200);
      expect(res.body.data.escalationLevel).toBe(2);
      expect(mockController.escalate).toHaveBeenCalled();
    });
    it("should NOT close ticket with L2 role", async () => {
      const res = await request(l2App)
        .put("/api/v1/ticket/1/close-ticket")
        .send({ resolution: "Fixed" });
      expect(res.status).toBe(403);
      expect(mockController.closeTicket).not.toHaveBeenCalled();
    });
    it("should NOT create ticket with L2 role", async () => {
      const res = await request(l2App)
        .post("/api/v1/ticket")
        .send({
          title: "Test Ticket",
          description: "Description",
          category: "IT",
          priority: "High",
          expectedCompletion: new Date().toISOString(),
        });
      expect(res.status).toBe(403);
      expect(mockController.createTicket).not.toHaveBeenCalled();
    });
  });
  describe("L3 Role Tests", () => {
    let l3App: any;
    beforeEach(() => {
      const l3User: SafeUserEntity = {
        _id: "user3",
        name: "Advanced Support",
        email: "l3@example.com",
        role: "L3",
      };
      l3App = createTestApp(ticketRouter, l3User, "/api/v1/ticket");
    });
    it("should close ticket with L3 role", async () => {
      const res = await request(l3App)
        .put("/api/v1/ticket/1/close-ticket")
        .send({ resolution: "Fixed" });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("Completed");
      expect(res.body.data.resolution).toBe("Fixed");
      expect(mockController.closeTicket).toHaveBeenCalled();
    });
    it("should NOT assign critical value with L3 role", async () => {
      const res = await request(l3App)
        .put("/api/v1/ticket/1/critical-value")
        .send({ level: "C1", note: "Urgent" });
      expect(res.status).toBe(403);
      expect(mockController.criticalValue).not.toHaveBeenCalled();
    });
    it("should NOT create ticket with L3 role", async () => {
      const res = await request(l3App)
        .post("/api/v1/ticket")
        .send({
          title: "Test Ticket",
          description: "Description",
          category: "IT",
          priority: "High",
          expectedCompletion: new Date().toISOString(),
        });
      expect(res.status).toBe(403);
      expect(mockController.createTicket).not.toHaveBeenCalled();
    });
    it("should NOT escalate ticket with L3 role", async () => {
      const res = await request(l3App)
        .put("/api/v1/ticket/1/escalate")
        .send({ toLevel: 1, note: "Need support" });
      expect(res.status).toBe(403);
      expect(mockController.escalate).not.toHaveBeenCalled();
    });
  });
});
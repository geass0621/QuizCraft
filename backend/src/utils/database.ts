import { PrismaClient } from "@prisma/client";

// DatabaseConnection class to manage PrismaClient instance
// This is a singleton pattern to ensure only one instance of PrismaClient is created
class DatabaseConnection {
  private static instance: PrismaClient;


  // method to get the singleton instance of PrismaClient
  // If the instance does not exist, it creates a new one
  public static getInstance(): PrismaClient {
    if(!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient();
    }

    return DatabaseConnection.instance;
  }

  // Method to disconnect the PrismaClient instance
  public static async disconnect(): Promise<void> {
    if(DatabaseConnection.instance) {
      await DatabaseConnection.instance.$disconnect();
    }
  }
}

export const prisma = DatabaseConnection.getInstance();
export const disconnectPrisma = DatabaseConnection.disconnect;
import { Request, Response } from "express";
import * as tenantService from "../services/tenantService";

export async function getTenants(req: Request, res: Response) {
    try {
        const tenants = await tenantService.getTenants();

        res.json(tenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch tenants", });
    }
}

export async function getTenant(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        const tenant = await tenantService.getTenant(
            id
        );

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found", });
        }

        res.json(tenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch tenant", });
    }
}

export async function createTenant(req: Request, res: Response) {
    try {
        const tenant = await tenantService.createTenant(
            req.body.companyName
        );

        res.status(201).json(tenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to create tenant", });
    }
}

export async function updateTenant(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        const tenant = await tenantService.updateTenant(
            id,
            req.body.companyName
        );

        res.json(tenant);
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "Tenant not found") {
            return res.status(404).json({ message: error.message, });
        }

        res.status(500).json({ message: "Unable to update tenant", });
    }
}

export async function deleteTenant(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        await tenantService.deleteTenant(
            id
        );

        res.json({ message: "Tenant deleted", });
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "Tenant not found") {
            return res.status(404).json({ message: error.message, });
        }

        res.status(500).json({ message: "Unable to delete tenant", });
    }
}
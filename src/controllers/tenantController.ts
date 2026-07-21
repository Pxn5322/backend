import { Request, Response } from "express";
import * as tenantService from "../services/tenantService";

export async function getCompanies(req: Request, res: Response) {
    try {
        const companies = await tenantService.getCompanies();
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch companies", });
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

export async function registerCompany(req: Request, res: Response) {
    try {
        const company = await tenantService.registerCompany(
            req.body
        );

        res.status(201).json(company);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: error instanceof Error ? error.message : "Unable to create company"
        });
    }
}

export async function updateTenant(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        const tenant = await tenantService.updateTenant(
            id,
            req.body.companyName,
            req.body.companyCode
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
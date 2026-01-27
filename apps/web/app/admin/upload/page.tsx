"use client";

import * as React from "react";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
    Upload, FileDown, FileText, CheckCircle,
    Users, Database, Building2, UserCog, ArrowRight, ArrowLeft
} from "lucide-react";

export default function DataUploadPage() {
    const [step, setStep] = React.useState(1);
    const [selectedTable, setSelectedTable] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [processResult, setProcessResult] = React.useState<{
        status: "idle" | "success" | "error";
        processed?: number;
        errors?: string[];
        message?: string;
    }>({ status: "idle" });

    const dataTypes = [
        { id: "mla_info", label: "MLA Information", icon: UserCog, description: "Personal & political details" },
        { id: "mla_social", label: "Social Media", icon: Users, description: "Social accounts & stats" },
        { id: "election_results", label: "Election Results", icon: CheckCircle, description: "Past election data" },
        { id: "ground_report", label: "Ground Report", icon: FileText, description: "Field reports (Coming Soon)" },
    ];

    const handleDownloadTemplate = async () => {
        try {
            // Fetch AC data for pre-filling
            const response = await fetch('/api/admin/constituencies'); // We need to create this or use existing
            const acData = await response.json(); // Expect array of { id, number, name }

            let headers = "ac_id,ac_number,ac_name";

            if (selectedTable === "mla_info") {
                headers += ",name,caste,category,ad_name,party_name,age,qualification,occupation,political_background,political_journey,ac_grade,total_voters,male_voters,female_voters,last_ae_turnout";
            } else if (selectedTable === "mla_social") {
                headers += ",platform,profile_link,account_verified,followers,posts,engagement,overall_rating";
            } else if (selectedTable === "election_results") {
                headers += ",election_year,election_type,candidate,candidate_caste,party,votes_get";
            } else if (selectedTable === "ground_report") {
                headers += ",title,content,author,report_date";
            }

            // Generate CSV Content with Pre-filled ACs
            const csvRows = [headers];
            acData.forEach((ac: any) => {
                csvRows.push(`${ac.id},${ac.number},"${ac.name}",`);
            });

            const csvString = csvRows.join("\n");
            const blob = new Blob([csvString], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${selectedTable}_template.csv`;
            a.click();
        } catch (error) {
            console.error("Failed to generate template", error);
            alert("Error generating template. Ensure API is reachable.");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleProcessFile = async () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        setIsProcessing(true);
        setProcessResult({ status: "idle" });

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("table", selectedTable);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setProcessResult({
                    status: "success",
                    processed: data.processed,
                    errors: data.errors,
                    message: `Successfully processed ${data.processed} rows.`
                });
            } else {
                setProcessResult({
                    status: "error",
                    message: data.error || "Processing failed"
                });
            }
        } catch (error: any) {
            console.error(error);
            setProcessResult({
                status: "error",
                message: error.message || "Network error"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setSelectedTable("");
        setSelectedFile(null);
        setProcessResult({ status: "idle" });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Data Upload Wizard</h1>
                <p className="text-gray-500">Follow the steps to bulk import data into the system.</p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center justify-between px-10 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2 bg-transparent px-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? "bg-[#E67E22] text-white shadow-lg shadow-orange-200" : "bg-gray-100 text-gray-400"
                            }`}>
                            {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                        </div>
                        <span className={`text-xs font-medium ${step >= s ? "text-[#E67E22]" : "text-gray-400"}`}>
                            {s === 1 ? "Select Type" : s === 2 ? "Download Template" : "Upload File"}
                        </span>
                    </div>
                ))}
            </div>

            <Card className="border-border/10 shadow-lg min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

                <CardContent className="p-8">
                    {/* Step 1: Selection */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            <h2 className="text-xl font-semibold text-center">What type of data are you uploading?</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {dataTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedTable(type.id)}
                                            className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 text-center
                                                ${selectedTable === type.id
                                                    ? "border-[#E67E22] bg-orange-50/50 shadow-sm ring-1 ring-[#E67E22]"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full ${selectedTable === type.id ? "bg-[#E67E22] text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{type.label}</div>
                                                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedTable}
                                    className="bg-[#E67E22] hover:bg-[#D35400] gap-2 px-8"
                                >
                                    Next Step <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Download */}
                    {step === 2 && (
                        <div className="max-w-md mx-auto space-y-8 animate-in slide-in-from-right-4 fade-in duration-300 text-center">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">Download Template</h2>
                                <p className="text-gray-500 text-sm">Get the correct CSV format for <strong>{dataTypes.find(t => t.id === selectedTable)?.label}</strong>.</p>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 flex flex-col items-center gap-4">
                                <FileText className="h-12 w-12 text-[#E67E22]" />
                                <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2 w-full max-w-xs border-[#E67E22] text-[#E67E22] hover:bg-orange-50">
                                    <FileDown className="h-4 w-4" /> Download CSV Template
                                </Button>
                                <p className="text-xs text-muted-foreground">Detailed instructions included in file.</p>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                                <Button onClick={() => setStep(3)} className="bg-[#E67E22] hover:bg-[#D35400] gap-2 px-8">
                                    Next Step <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Upload & Process */}
                    {step === 3 && processResult.status !== "success" && (
                        <div className="max-w-lg mx-auto space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="space-y-2 text-center">
                                <h2 className="text-xl font-semibold">Upload & Process Data</h2>
                                <p className="text-gray-500 text-sm">Select your filled CSV file and process it.</p>
                            </div>

                            {/* File Selection */}
                            <label htmlFor="fileUpload" className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="p-4 bg-gray-100 rounded-full mb-4 group-hover:bg-white transition-colors">
                                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-[#E67E22]" />
                                </div>
                                {selectedFile ? (
                                    <>
                                        <span className="text-sm text-[#E67E22] font-medium">{selectedFile.name}</span>
                                        <span className="text-xs text-gray-400 mt-1">Click to change file</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm text-gray-700 font-medium">Click to select file</span>
                                        <span className="text-xs text-gray-400 mt-2">.csv supported (Max 10MB)</span>
                                    </>
                                )}
                                <input
                                    id="fileUpload"
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </label>

                            {/* Processing Status */}
                            {isProcessing && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-blue-700 text-sm">Processing file...</p>
                                </div>
                            )}

                            {/* Error Display */}
                            {processResult.status === "error" && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                                    <p className="text-red-700 font-medium">Processing Failed</p>
                                    <p className="text-red-600 text-sm mt-1">{processResult.message}</p>
                                </div>
                            )}

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" type="button" onClick={() => setStep(2)} className="gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                                <Button
                                    onClick={handleProcessFile}
                                    className="bg-[#E67E22] hover:bg-[#D35400] gap-2 px-8"
                                    disabled={!selectedFile || isProcessing}
                                >
                                    {isProcessing ? "Processing..." : "Process File"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {processResult.status === "success" && (
                        <div className="text-center space-y-6 py-10 animate-in zoom-in-95 fade-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Processing Complete!</h2>
                                <p className="text-gray-500 mt-2">{processResult.message}</p>
                                {processResult.errors && processResult.errors.length > 0 && (
                                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-md mx-auto">
                                        <p className="text-yellow-800 font-medium text-sm">Some rows had issues:</p>
                                        <ul className="text-yellow-700 text-xs mt-2 list-disc list-inside max-h-32 overflow-y-auto">
                                            {processResult.errors.slice(0, 5).map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                            {processResult.errors.length > 5 && (
                                                <li>...and {processResult.errors.length - 5} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <Button onClick={resetFlow} variant="outline" className="mt-4">
                                Upload More Data
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

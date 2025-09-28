"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, User, Code, Users } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data - replace with actual API calls
const managers = [
  { id: "1", name: "John Smith", email: "john.smith@company.com" },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
  { id: "3", name: "Mike Davis", email: "mike.davis@company.com" },
];

const techLeads = [
  { id: "1", name: "Alice Brown", email: "alice.brown@company.com" },
  { id: "2", name: "Bob Wilson", email: "bob.wilson@company.com" },
  { id: "3", name: "Carol Martinez", email: "carol.martinez@company.com" },
];

const availableSkills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "Machine Learning",
  "DevOps",
  "CI/CD",
];

const developers = [
  { id: "1", name: "David Lee", email: "david.lee@company.com", skills: ["React", "TypeScript", "Node.js"] },
  {
    id: "2",
    name: "Emma Taylor",
    email: "emma.taylor@company.com",
    skills: ["Python", "Machine Learning", "PostgreSQL"],
  },
  { id: "3", name: "James Rodriguez", email: "james.rodriguez@company.com", skills: ["Java", "Docker", "AWS"] },
  { id: "4", name: "Lisa Chen", email: "lisa.chen@company.com", skills: ["Go", "Kubernetes", "DevOps"] },
];

export default function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedTechLead, setSelectedTechLead] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<string[]>([]);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [developersOpen, setDevelopersOpen] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  const handleDeveloperToggle = (developerId: string) => {
    setSelectedDevelopers((prev) =>
      prev.includes(developerId) ? prev.filter((id) => id !== developerId) : [...prev, developerId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      projectName,
      description,
      selectedManager,
      selectedTechLead,
      selectedSkills,
      selectedDevelopers,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground mt-2">Set up a new project with team members and required skills</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Project Information
            </CardTitle>
            <CardDescription>Basic details about the project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the project objectives and scope"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Leadership */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Project Leadership
            </CardTitle>
            <CardDescription>Assign manager and technical lead for the project</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Project Manager *</Label>
              <Select value={selectedManager} onValueChange={setSelectedManager} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      <div className="flex flex-col">
                        <span>{manager.name}</span>
                        <span className="text-sm text-muted-foreground">{manager.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Technical Lead *</Label>
              <Select value={selectedTechLead} onValueChange={setSelectedTechLead} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tech lead" />
                </SelectTrigger>
                <SelectContent>
                  {techLeads.map((techLead) => (
                    <SelectItem key={techLead.id} value={techLead.id}>
                      <div className="flex flex-col">
                        <span>{techLead.name}</span>
                        <span className="text-sm text-muted-foreground">{techLead.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Required Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
            <CardDescription>Select the technical skills required for this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={skillsOpen} className="justify-between">
                  <Plus className="h-4 w-4" />
                  Add Skills
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <Command>
                  <CommandInput placeholder="Search skills..." />
                  <CommandEmpty>No skills found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {availableSkills.map((skill) => (
                      <CommandItem key={skill} onSelect={() => handleSkillToggle(skill)}>
                        <Checkbox checked={selectedSkills.includes(skill)} className="mr-2" />
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSkillToggle(skill)} />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optional Developers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members (Optional)
            </CardTitle>
            <CardDescription>Optionally assign developers to the project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Popover open={developersOpen} onOpenChange={setDevelopersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={developersOpen} className="justify-between">
                  <Plus className="h-4 w-4" />
                  Add Developers
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <Command>
                  <CommandInput placeholder="Search developers..." />
                  <CommandEmpty>No developers found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {developers.map((developer) => (
                      <CommandItem key={developer.id} onSelect={() => handleDeveloperToggle(developer.id)}>
                        <Checkbox checked={selectedDevelopers.includes(developer.id)} className="mr-3" />
                        <div className="flex-1">
                          <div className="font-medium">{developer.name}</div>
                          <div className="text-sm text-muted-foreground">{developer.email}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {developer.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {developer.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{developer.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedDevelopers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Developers ({selectedDevelopers.length})</Label>
                <div className="space-y-2">
                  {selectedDevelopers.map((developerId) => {
                    const developer = developers.find((d) => d.id === developerId);
                    if (!developer) return null;

                    return (
                      <div key={developerId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{developer.name}</div>
                          <div className="text-sm text-muted-foreground">{developer.email}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {developer.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeveloperToggle(developerId)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </div>
  );
}

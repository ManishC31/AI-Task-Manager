"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mail, Phone, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "on-leave";
  hireDate: string;
  phone: string;
  assignedProjects: string[];
}

export default function EmployeesList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock employee data
  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=150",
      role: "Frontend Developer",
      department: "Engineering",
      status: "active",
      hireDate: "2023-01-15",
      phone: "+1 (555) 123-4567",
      assignedProjects: ["E-commerce Platform", "Mobile App Redesign"],
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@company.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "Backend Developer",
      department: "Engineering",
      status: "active",
      hireDate: "2022-08-22",
      phone: "+1 (555) 234-5678",
      assignedProjects: ["API Gateway", "Database Migration", "Authentication Service"],
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@company.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      role: "Product Manager",
      department: "Product",
      status: "active",
      hireDate: "2022-03-10",
      phone: "+1 (555) 345-6789",
      assignedProjects: ["Product Roadmap", "User Research"],
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david.wilson@company.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "UI/UX Designer",
      department: "Design",
      status: "on-leave",
      hireDate: "2023-06-01",
      phone: "+1 (555) 456-7890",
      assignedProjects: ["Design System", "Mobile App Redesign"],
    },
    {
      id: "5",
      name: "Eva Martinez",
      email: "eva.martinez@company.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "DevOps Engineer",
      department: "Engineering",
      status: "active",
      hireDate: "2021-11-12",
      phone: "+1 (555) 567-8901",
      assignedProjects: ["CI/CD Pipeline", "Cloud Infrastructure"],
    },
  ]);

  const loadEmployeeData = async () => {
    // Future implementation for loading data from API
  };

  // Get unique values for filter options
  const uniqueRoles = Array.from(new Set(employees.map((emp) => emp.role))).sort();
  const uniqueDepartments = Array.from(new Set(employees.map((emp) => emp.department))).sort();
  const uniqueProjects = Array.from(new Set(employees.flatMap((emp) => emp.assignedProjects))).sort();

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || employee.role === selectedRole;
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
    const matchesProject = selectedProject === "all" || employee.assignedProjects.includes(selectedProject);

    return matchesSearch && matchesRole && matchesDepartment && matchesProject;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const getStatusBadgeVariant = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "on-leave":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedDepartment("all");
    setSelectedProject("all");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const hasActiveFilters =
    searchTerm !== "" || selectedRole !== "all" || selectedDepartment !== "all" || selectedProject !== "all";

  // Reset to first page when filters change
  const handleFilterChange = (filterFunction: () => void) => {
    filterFunction();
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage and view all company employees</p>
        </div>
        <Button onClick={() => router.push("/admin/employees/create")}>Add Employee</Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
            className="pl-10"
          />
        </div>

        <Select value={selectedRole} onValueChange={(value) => handleFilterChange(() => setSelectedRole(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedDepartment}
          onValueChange={(value) => handleFilterChange(() => setSelectedDepartment(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedProject} onValueChange={(value) => handleFilterChange(() => setSelectedProject(value))}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center space-x-1">
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: {searchTerm}
            </Badge>
          )}
          {selectedRole !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Role: {selectedRole}
            </Badge>
          )}
          {selectedDepartment !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Department: {selectedDepartment}
            </Badge>
          )}
          {selectedProject !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Project: {selectedProject}
            </Badge>
          )}
          <span className="ml-2">({filteredEmployees.length} results)</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role & Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Assigned Projects</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar>
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{employee.role}</div>
                    <div className="text-sm text-muted-foreground">{employee.department}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-3 w-3 mr-1" />
                    {employee.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(employee.status)}>{employee.status.replace("-", " ")}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.assignedProjects.map((project, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredEmployees.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length}{" "}
              results
            </p>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No employees found matching your search.</p>
        </div>
      )}
    </div>
  );
}

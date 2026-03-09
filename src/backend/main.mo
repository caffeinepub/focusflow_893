import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Bool "mo:core/Bool";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type Priority = { #low; #medium; #high };

  public type Project = {
    id : Text;
    name : Text;
    color : Text;
  };

  public type Task = {
    id : Text;
    title : Text;
    description : Text;
    priority : Priority;
    dueDate : ?Text; // ISO timestamp
    completed : Bool;
    notes : Text;
    projectId : ?Text;
  };

  public type DashboardSummary = {
    totalTasks : Nat;
    completedTasks : Nat;
    pendingTasks : Nat;
    overdueTasks : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module Text {
    public func contains(text : Text, search : Text) : Bool {
      let textLength = text.size();
      let searchLength = search.size();

      if (searchLength == 0) { return true };

      if (searchLength > textLength) { return false };

      func matchAt(textPos : Nat, searchPos : Nat) : Bool {
        if (searchPos == searchLength) { return true };
        if (textPos == textLength) { return false };

        let textIter = text.chars().drop(textPos).take(1);
        let searchIter = search.chars().drop(searchPos).take(1);

        switch (textIter.next(), searchIter.next()) {
          case (?textChar, ?searchChar) {
            if (textChar == searchChar) {
              matchAt(textPos + 1, searchPos + 1);
            } else {
              false;
            };
          };
          case (_) { false };
        };
      };

      func checkAllPositions(pos : Nat) : Bool {
        if (pos + searchLength > textLength) {
          false;
        } else if (matchAt(pos, 0)) {
          true;
        } else {
          checkAllPositions(pos + 1);
        };
      };

      checkAllPositions(0);
    };
  };

  // Persistent storage
  let projects = Map.empty<Principal, Map.Map<Text, Project>>();
  let tasks = Map.empty<Principal, Map.Map<Text, Task>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project CRUD
  public shared ({ caller }) func createProject(id : Text, name : Text, color : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };

    if (id == "" or name == "") {
      Runtime.trap("Project ID and name cannot be empty");
    };

    let userProjects = switch (projects.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, Project>();
        projects.add(caller, newMap);
        newMap;
      };
      case (?existing) { existing };
    };

    if (userProjects.containsKey(id)) {
      Runtime.trap("Project ID already exists");
    };

    let project : Project = { id; name; color };
    userProjects.add(id, project);
  };

  public shared ({ caller }) func updateProject(id : Text, name : Text, color : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };

    let userProjects = switch (projects.get(caller)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existing) { existing };
    };

    let project : Project = { id; name; color };
    userProjects.add(id, project);
  };

  public shared ({ caller }) func deleteProject(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };

    if (projectId == "") { Runtime.trap("Project ID cannot be empty") };

    switch (projects.get(caller)) {
      case (null) { Runtime.trap("Project not found") };
      case (?userProjects) {
        userProjects.remove(projectId);

        // Update tasks that reference the deleted project
        switch (tasks.get(caller)) {
          case (null) {};
          case (?userTasks) {
            let updatedTasks = userTasks.entries().toArray().map(
              func((k, v)) {
                (k, { v with projectId = switch (v.projectId) { case (?pid) { if (pid == projectId) { null } else { ?pid } }; case (null) { null } } });
              }
            );
            userTasks.clear();
            for ((k, v) in updatedTasks.values()) {
              userTasks.add(k, v);
            };
          };
        };
      };
    };
  };

  // Task CRUD
  public shared ({ caller }) func createTask(id : Text, title : Text, desc : Text, priority : Priority, dueDate : ?Text, notes : Text, projectId : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };

    if (id == "" or title == "") {
      Runtime.trap("Task ID and title cannot be empty");
    };

    let userTasks = switch (tasks.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, Task>();
        tasks.add(caller, newMap);
        newMap;
      };
      case (?existing) { existing };
    };

    if (userTasks.containsKey(id)) {
      Runtime.trap("Task ID already exists");
    };

    let task : Task = {
      id;
      title;
      description = desc;
      priority;
      dueDate;
      completed = false;
      notes;
      projectId;
    };

    userTasks.add(id, task);
  };

  public shared ({ caller }) func updateTask(id : Text, title : Text, desc : Text, priority : Priority, dueDate : ?Text, notes : Text, projectId : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };

    let userTasks = switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task not found") };
      case (?existing) { existing };
    };

    let task : Task = {
      id;
      title;
      description = desc;
      priority;
      dueDate;
      completed = false;
      notes;
      projectId;
    };

    userTasks.add(id, task);
  };

  public shared ({ caller }) func deleteTask(taskId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };

    if (taskId == "") { Runtime.trap("Task ID cannot be empty") };

    switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task not found") };
      case (?userTasks) {
        userTasks.remove(taskId);
      };
    };
  };

  // Task Completion
  public shared ({ caller }) func toggleTaskCompletion(taskId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle task completion");
    };

    switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task not found") };
      case (?userTasks) {
        if (not userTasks.containsKey(taskId)) { Runtime.trap("Task not found") };
        let currentTask = switch (userTasks.get(taskId)) {
          case (null) { Runtime.trap("Task not found") };
          case (?task) { task };
        };
        let updatedTask = { currentTask with completed = not currentTask.completed };
        userTasks.add(taskId, updatedTask);
      };
    };
  };

  // Queries
  public query ({ caller }) func getAllProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    switch (projects.get(caller)) {
      case (null) { [] };
      case (?userProjects) { userProjects.values().toArray() };
    };
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    switch (tasks.get(caller)) {
      case (null) { [] };
      case (?userTasks) { userTasks.values().toArray() };
    };
  };

  public query ({ caller }) func getTasksByProject(projectId : Text) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    switch (tasks.get(caller)) {
      case (null) { [] };
      case (?userTasks) {
        let filteredTasks = userTasks.values().toArray().filter(func(t) { t.projectId == ?projectId });
        filteredTasks;
      };
    };
  };

  public query ({ caller }) func getTasksByCompletion(isCompleted : Bool) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    switch (tasks.get(caller)) {
      case (null) { [] };
      case (?userTasks) {
        let filteredTasks = userTasks.values().toArray().filter(func(t) { t.completed == isCompleted });
        filteredTasks;
      };
    };
  };

  public query ({ caller }) func searchTasks(searchTerm : Text) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search tasks");
    };

    if (searchTerm == "") { [] } else {
      switch (tasks.get(caller)) {
        case (null) { [] };
        case (?userTasks) {
          let filteredTasks = userTasks.values().toArray().filter(
            func(t) {
              Text.contains(t.title, searchTerm) or Text.contains(t.description, searchTerm);
            }
          );
          filteredTasks;
        };
      };
    };
  };

  public query ({ caller }) func getDashboardSummary() : async DashboardSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard");
    };

    switch (tasks.get(caller)) {
      case (null) {
        {
          totalTasks = 0;
          completedTasks = 0;
          pendingTasks = 0;
          overdueTasks = 0;
        };
      };
      case (?userTasks) {
        let allTasks = userTasks.values().toArray();
        let totalTasks = allTasks.size();
        let completedTasks = allTasks.filter(func(t) { t.completed }).size();
        let pendingTasks = allTasks.filter(func(t) { not t.completed }).size();

        // Note: Overdue calculation would require current timestamp comparison
        // For now, returning 0 as placeholder
        let overdueTasks = 0;

        {
          totalTasks;
          completedTasks;
          pendingTasks;
          overdueTasks;
        };
      };
    };
  };
};

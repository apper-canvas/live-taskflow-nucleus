const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const taskService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ]
      };

      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async getByCategory(categoryId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [parseInt(categoryId, 10)]
          }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      throw error;
    }
  },

  async getTodayTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "due_date",
                    operator: "LessThanOrEqualTo",
                    values: [today]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "completed",
                    operator: "EqualTo",
                    values: ["false"]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "priority", sorttype: "DESC" },
          { fieldName: "due_date", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      throw error;
    }
  },

  async getOverdueTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "due_date",
                    operator: "LessThan",
                    values: [today]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "completed",
                    operator: "EqualTo",
                    values: ["false"]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "due_date", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: taskData.Name || taskData.title,
            Tags: taskData.Tags || "",
            Owner: taskData.Owner || null,
            title: taskData.title,
            description: taskData.description || "",
            category: parseInt(taskData.category, 10),
            priority: parseInt(taskData.priority, 10),
            due_date: taskData.due_date || taskData.dueDate,
            completed: false,
            created_at: new Date().toISOString(),
            order: taskData.order || 0
          }
        ]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }
        
        return successfulRecords[0]?.data || null;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      // Only include Updateable fields and Id
      const updateData = {
        Id: parseInt(id, 10)
      };

      if (taskData.Name !== undefined) updateData.Name = taskData.Name;
      if (taskData.Tags !== undefined) updateData.Tags = taskData.Tags;
      if (taskData.Owner !== undefined) updateData.Owner = taskData.Owner;
      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.category !== undefined) updateData.category = parseInt(taskData.category, 10);
      if (taskData.priority !== undefined) updateData.priority = parseInt(taskData.priority, 10);
      if (taskData.due_date !== undefined) updateData.due_date = taskData.due_date;
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate;
      if (taskData.completed !== undefined) updateData.completed = taskData.completed;
      if (taskData.order !== undefined) updateData.order = parseInt(taskData.order, 10);

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update task');
        }
        
        return successfulRecords[0]?.data || null;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete task');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async reorder(taskIds) {
    try {
      const records = taskIds.map((taskId, index) => ({
        Id: parseInt(taskId, 10),
        order: index
      }));

      const params = { records };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error reordering tasks:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "priority", sorttype: "DESC" },
          { fieldName: "due_date", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }
};

export default taskService;
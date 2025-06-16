const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const categoryService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } }
        ],
        aggregators: [
          {
            id: 'TaskCounts',
            fields: [
              { field: { Name: "Id" }, Function: 'Count', Alias: 'Count' }
            ],
            table: { Name: 'task' },
            groupBy: ["category"]
          }
        ]
      };

      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
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
          { field: { Name: "color" } },
          { field: { Name: "task_count" } }
        ]
      };

      const response = await apperClient.getRecordById('category', parseInt(id, 10), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: categoryData.Name || categoryData.name,
            Tags: categoryData.Tags || "",
            Owner: categoryData.Owner || null,
            color: categoryData.color || "#5B4CFF",
            task_count: 0
          }
        ]
      };

      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create category');
        }
        
        return successfulRecords[0]?.data || null;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async update(id, categoryData) {
    try {
      // Only include Updateable fields and Id
      const updateData = {
        Id: parseInt(id, 10)
      };

      if (categoryData.Name !== undefined) updateData.Name = categoryData.Name;
      if (categoryData.name !== undefined) updateData.Name = categoryData.name;
      if (categoryData.Tags !== undefined) updateData.Tags = categoryData.Tags;
      if (categoryData.Owner !== undefined) updateData.Owner = categoryData.Owner;
      if (categoryData.color !== undefined) updateData.color = categoryData.color;
      if (categoryData.task_count !== undefined) updateData.task_count = parseInt(categoryData.task_count, 10);

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update category');
        }
        
        return successfulRecords[0]?.data || null;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete category');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoryService;
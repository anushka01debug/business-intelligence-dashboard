import { Filter, RotateCcw } from "lucide-react";

export default function DateFilter({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  region,
  setRegion,
  category,
  setCategory,
  regionsList,
  categoriesList,
  onApply,
  onClear,
}) {
  return (
    <section className="filter-card">
      <div className="filter-title">
        <div className="filter-title-left">
          <Filter size={18} className="filter-icon" />
          <h2>Filter & Analytics Parameters</h2>
        </div>
        <p>Filter business performance data by order date, customer region, and product category</p>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Region</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All Regions</option>
            {regionsList.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-buttons">
          <button className="apply-button" onClick={onApply}>
            <Filter size={15} />
            Apply Filter
          </button>

          <button className="clear-button" onClick={onClear}>
            <RotateCcw size={15} />
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  );
}

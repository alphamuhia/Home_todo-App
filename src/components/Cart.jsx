import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Roboto', sans-serif",
    padding: '1rem'
  },
  list: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333',
    textAlign: 'center'
  },
  insideContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '900px',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    overflowY: 'auto'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  categoryCard: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
    cursor: 'pointer'
  },
  categoryHeader: {
    fontSize: '1.75rem',
    color: '#333',
    textTransform: 'capitalize',
    margin: 0
  },
  itemText: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    color: '#555'
  },
  itemForm: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  itemInput: {
    flex: '1 1 200px',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  itemSelect: {
    flex: '1 1 200px',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  itemADD: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3'
    }
  },
  li: {
    backgroundColor: '#ffffff',
    marginBottom: '0.75rem',
    padding: '1rem',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'red',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  editButton: {
    backgroundColor: '#ffc107',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.3rem 0.6rem',
    borderRadius: '3px',
    marginRight: '0.5rem'
  },
  saveButton: {
    backgroundColor: '#28a745',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.3rem 0.6rem',
    borderRadius: '3px',
    marginRight: '0.5rem'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.3rem 0.6rem',
    borderRadius: '3px'
  },
  boughtButton: {
    backgroundColor: '#28a745',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.3rem 0.6rem',
    borderRadius: '3px',
    marginRight: '0.5rem'
  },
  searchContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  timerText: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#555'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative'
  },
  modalCloseButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  }
}));

function ShoppingList() {
  const classes = useStyles();
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('shoppingListItems')) || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    itemName: "",
    category: "",
    quantityToBuy: "",
    quantityAvailable: "",
    price: "",
    bought: false
  });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [openCategory, setOpenCategory] = useState(null); // currently open modal category

  const threeWeeksInMs = 21 * 24 * 60 * 60 * 1000;

  // Update currentTime every second (for real-time timer)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to format remaining time
  const formatTime = (ms) => {
    if (ms <= 0) return "Expired";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleAddItem = (item) => {
    setItems(prev => [
      ...prev,
      { ...item, id: Date.now(), bought: false, boughtAt: null }
    ]);
  };

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      itemName: item.itemName,
      category: item.category,
      quantityToBuy: item.quantityToBuy,
      quantityAvailable: item.quantityAvailable,
      price: item.price,
      bought: item.bought
    });
  };

  const handleSaveEdit = (id) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const quantityToBuy = parseInt(editForm.quantityToBuy, 10);
          const quantityAvailable = editForm.bought
            ? quantityToBuy
            : parseInt(editForm.quantityAvailable, 10);
          return {
            ...item,
            itemName: editForm.itemName,
            category: editForm.category,
            quantityToBuy,
            quantityAvailable,
            price: parseFloat(editForm.price),
            bought: editForm.bought,
            boughtAt: editForm.bought ? Date.now() : null
          };
        }
        return item;
      })
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    const { name, type, checked, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const itemName = form.elements.itemName.value.trim();
    const category = form.elements.category.value;
    const quantityToBuy = parseInt(form.elements.quantityToBuy.value, 10);
    const quantityAvailable = parseInt(form.elements.quantityAvailable.value, 10);
    const price = parseFloat(form.elements.price.value);

    if (itemName && category && !isNaN(quantityToBuy) && !isNaN(quantityAvailable) && !isNaN(price)) {
      handleAddItem({ itemName, category, quantityToBuy, quantityAvailable, price });
    }
    form.reset();
  };

  useEffect(() => {
    localStorage.setItem('shoppingListItems', JSON.stringify(items));
  }, [items]);

  const overallTotal = items.reduce((acc, item) => {
    if (item.bought) return acc;
    const needed = Math.max(item.quantityToBuy - item.quantityAvailable, 0);
    return acc + item.price * needed;
  }, 0);

  const handleMarkBought = (id) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id && !item.bought) {
          const needed = Math.max(item.quantityToBuy - item.quantityAvailable, 0);
          return {
            ...item,
            bought: true,
            quantityAvailable: item.quantityAvailable + needed,
            boughtAt: Date.now()
          };
        }
        return item;
      })
    );
  };

  // Expire bought status after 3 weeks (check every second)
  useEffect(() => {
    const expirationInterval = setInterval(() => {
      setItems(prev =>
        prev.map(item => {
          if (item.bought && item.boughtAt && Date.now() - item.boughtAt > threeWeeksInMs) {
            return { ...item, bought: false, boughtAt: null };
          }
          return item;
        })
      );
    }, 1000);
    return () => clearInterval(expirationInterval);
  }, [threeWeeksInMs]);

  // Filter and group items by category
  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterCategory === "" || item.category === filterCategory)
  );

  const groupedItems = filteredItems.reduce((groups, item) => {
    const cat = item.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
    return groups;
  }, {});

  return (
    <div className={classes.container}>
      <div className={classes.insideContainer}>
        <h1 className={classes.list}>Shopping List</h1>
        <h2 className={classes.itemText}>Items To Buy</h2>

        {/* Add Item Form */}
        <form className={classes.itemForm} onSubmit={handleSubmit}>
          <input className={classes.itemInput} type="text" name="itemName" placeholder="Add a new item" required />
          <select className={classes.itemSelect} name="category" required>
            <option value="">Select Category</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="toiletries">Toiletries</option>
            <option value="dairy">Dairy</option>
            <option value="bakery">Bakery</option>
            <option value="other">Other</option>
          </select>
          <input className={classes.itemInput} type="number" name="price" placeholder="Price per Unit" required step="0.01" min="0" />
          <input className={classes.itemInput} type="number" name="quantityToBuy" placeholder="Quantity to Buy" required min="1" />
          <input className={classes.itemInput} type="number" name="quantityAvailable" placeholder="Already Available" required min="0" />
          <button className={classes.itemADD} type="submit">Add</button>
        </form>

        {/* Search and Filter */}
        <div className={classes.searchContainer}>
          <input
            className={classes.itemInput}
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className={classes.itemSelect}
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="toiletries">Toiletries</option>
            <option value="dairy">Dairy</option>
            <option value="bakery">Bakery</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Overall Total */}
        <div className={classes.itemText}>
          Overall Total: Ksh. {overallTotal.toFixed(2)}
        </div>

        {/* Category Cards in Grid */}
        <div className={classes.gridContainer}>
          {Object.keys(groupedItems).map(category => (
            <div
              key={category}
              className={classes.categoryCard}
              onClick={() => setOpenCategory(category)}
            >
              <h2 className={classes.categoryHeader}>{category}</h2>
            </div>
          ))}
        </div>

        {/* Modal Popup for Category Items */}
        {openCategory && (
          <div className={classes.modalOverlay}>
            <div className={classes.modalContent}>
              <button className={classes.modalCloseButton} onClick={() => setOpenCategory(null)}>
                ×
              </button>
              <h2 className={classes.categoryHeader}>{openCategory}</h2>
              {groupedItems[openCategory]?.map(item => {
                const needed = Math.max(item.quantityToBuy - item.quantityAvailable, 0);
                const itemTotal = (item.price * needed).toFixed(2);
                return (
                  <div key={item.id} className={classes.li}>
                    {editingId === item.id ? (
                      // Edit Mode with Labeled Fields
                      <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Item Name</label>
                          <input
                            className={classes.itemInput}
                            type="text"
                            name="itemName"
                            value={editForm.itemName}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Category</label>
                          <select
                            className={classes.itemSelect}
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                          >
                            <option value="fruits">Fruits</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="toiletries">Toiletries</option>
                            <option value="dairy">Dairy</option>
                            <option value="bakery">Bakery</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Price per Unit</label>
                          <input
                            className={classes.itemInput}
                            type="number"
                            name="price"
                            step="0.01"
                            value={editForm.price}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Quantity to Buy</label>
                          <input
                            className={classes.itemInput}
                            type="number"
                            name="quantityToBuy"
                            value={editForm.quantityToBuy}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Quantity Available</label>
                          <input
                            className={classes.itemInput}
                            type="number"
                            name="quantityAvailable"
                            value={editForm.quantityAvailable}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className={classes.checkboxContainer}>
                          <input
                            type="checkbox"
                            name="bought"
                            checked={editForm.bought}
                            onChange={handleEditChange}
                          />
                          <label>Bought</label>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <button className={classes.saveButton} onClick={() => handleSaveEdit(item.id)}>
                            Save
                          </button>
                          <button className={classes.cancelButton} onClick={handleCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div>
                          <strong>{item.itemName}</strong> <em>({item.category})</em>
                        </div>
                        <div>Price per Unit: Ksh. {parseFloat(item.price).toFixed(2)}</div>
                        <div>Need: {item.quantityToBuy} | Available: {item.quantityAvailable}</div>
                        <div>Needed to Buy: {needed} | Total: Ksh. {itemTotal}</div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <button className={classes.editButton} onClick={() => handleEdit(item)}>
                            Edit
                          </button>
                          <button className={classes.button} onClick={() => handleRemoveItem(item.id)}>
                            &times;
                          </button>
                          {!item.bought ? (
                            <button className={classes.boughtButton} onClick={() => handleMarkBought(item.id)}>
                              Mark as Bought
                            </button>
                          ) : (
                            <span style={{ color: '#28a745', fontWeight: 'bold' }}>Bought</span>
                          )}
                        </div>
                        {item.bought && item.boughtAt && (
                          <>
                            <div className={classes.timerText}>
                              Time remaining: {formatTime(threeWeeksInMs - (currentTime - item.boughtAt))}
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                              Bought on: {new Date(item.boughtAt).toLocaleString()}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;

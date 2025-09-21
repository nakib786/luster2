'use client';

import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, Search, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface Category {
  _id: string;
  name: string;
  visible: boolean;
}

interface OptionChoice {
  name: string;
  choices: string[];
}

interface FilterState {
  priceRange: { max: number };
  selectedOptions: Record<string, string[]>;
  search: string;
  sortBy: string;
  selectedCategory: string;
}

interface FilterSidePanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: Category[];
  availableOptions: OptionChoice[];
  loading: boolean;
  onRefresh: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilterSidePanel: React.FC<FilterSidePanelProps> = ({
  filters,
  setFilters,
  categories,
  availableOptions,
  loading,
  onRefresh,
  isOpen,
  onOpenChange,
}) => {
  const maxPrice = 10000000; // 10 million max price
  const { effectiveTheme } = useTheme();

  const clearAllFilters = () => {
    setFilters({
      priceRange: { max: maxPrice },
      selectedOptions: {},
      search: '',
      sortBy: 'name-asc',
      selectedCategory: 'all'
    });
  };

  const removeOptionFilter = (optionName: string, choice: string) => {
    setFilters(prev => {
      const currentChoices = prev.selectedOptions[optionName] || [];
      const newChoices = currentChoices.filter(c => c !== choice);
      
      return {
        ...prev,
        selectedOptions: {
          ...prev.selectedOptions,
          [optionName]: newChoices
        }
      };
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Count category filter
    if (filters.selectedCategory !== 'all') count++;
    
    // Count search filter
    if (filters.search !== '') count++;
    
    // Count price filter
    if (filters.priceRange.max < maxPrice) count++;
    
    // Count option filters
    Object.values(filters.selectedOptions).forEach(choices => {
      if (choices.length > 0) count++;
    });
    
    return count;
  };

  const hasActiveFilters = () => {
    return getActiveFiltersCount() > 0;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 border-0 bg-transparent overflow-hidden">
        {/* Glass Morphism Container */}
        <div className="relative h-full w-full">
          {/* Outer Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-white/30 to-amber-400/20 rounded-r-2xl blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.01, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Inner Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-300/10 via-white/20 to-amber-300/10 rounded-r-2xl blur-lg"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1.01, 1.02, 1.01],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />

          {/* Main Glass Container */}
          <div className={`relative h-full backdrop-blur-xl rounded-r-2xl shadow-2xl overflow-hidden theme-transition ${
            effectiveTheme === 'dark' 
              ? 'bg-black/20 border border-white/20' 
              : 'bg-white/10 border border-white/20'
          }`}>
            {/* Glass Top Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            
            {/* Glass Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            
            {/* Glass Right Border */}
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            
            {/* Inner Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-tr-2xl" />
            
            {/* Content Container - Single Scrollable Area with Fancy Scrollbar */}
            <div className="relative h-full overflow-y-auto p-6 scrollbar-fancy">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2 text-foreground">
                  <Filter className="h-5 w-5" />
                  Product Filters
                </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Refine your search to find the perfect products
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Clear All Filters */}
                {hasActiveFilters() && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active filters</span>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs">
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10 bg-background/50 backdrop-blur-sm border-border/50"
                    />
                    {filters.search && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Categories</label>
                    <div className="space-y-2">
                      <Button
                        variant={filters.selectedCategory === 'all' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start bg-background/50 backdrop-blur-sm border-border/50"
                        onClick={() => setFilters(prev => ({ ...prev, selectedCategory: 'all' }))}
                      >
                        All Products
                      </Button>
                      {categories.map(category => (
                        <Button
                          key={category._id}
                          variant={filters.selectedCategory === category._id ? 'default' : 'outline'}
                          size="sm"
                          className="w-full justify-start bg-background/50 backdrop-blur-sm border-border/50"
                          onClick={() => setFilters(prev => ({ ...prev, selectedCategory: category._id }))}
                        >
                          {String(category.name)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="bg-border/50" />

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Max Price: ${filters.priceRange.max.toLocaleString()}
                  </label>
                  <Slider
                    value={[filters.priceRange.max]}
                    onValueChange={([value]) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: { max: value }
                    }))}
                    max={maxPrice}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>${maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border/50">
                      <SelectValue placeholder="Select sorting option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="price-asc">Price Low-High</SelectItem>
                      <SelectItem value="price-desc">Price High-Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Options */}
                {availableOptions.length > 0 && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">Product Options</label>
                      {availableOptions.map(option => (
                        <div key={option.name} className="space-y-2">
                          <span className="text-sm text-muted-foreground">{option.name}</span>
                          <div className="flex flex-wrap gap-2">
                            {option.choices.map(choice => {
                              const isSelected = filters.selectedOptions[option.name]?.includes(choice) || false;
                              return (
                                <Badge
                                  key={choice}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`cursor-pointer hover:bg-primary hover:text-primary-foreground bg-background/50 backdrop-blur-sm border-border/50 ${
                                    isSelected ? '' : 'hover:border-primary'
                                  }`}
                                  onClick={() => {
                                    setFilters(prev => {
                                      const currentChoices = prev.selectedOptions[option.name] || [];
                                      const newChoices = currentChoices.includes(choice)
                                        ? currentChoices.filter(c => c !== choice)
                                        : [...currentChoices, choice];
                                      
                                      return {
                                        ...prev,
                                        selectedOptions: {
                                          ...prev.selectedOptions,
                                          [option.name]: newChoices
                                        }
                                      };
                                    });
                                  }}
                                >
                                  {choice}
                                  {isSelected && (
                                    <X 
                                      className="h-3 w-3 ml-1" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeOptionFilter(option.name, choice);
                                      }}
                                    />
                                  )}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Separator className="bg-border/50" />

                {/* Refresh Button */}
                <Button
                  onClick={onRefresh}
                  disabled={loading}
                  className="w-full gap-2 bg-background/50 backdrop-blur-sm border-border/50"
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSidePanel;

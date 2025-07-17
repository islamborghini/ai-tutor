import React, { useState } from 'react';

/**
 * Mathematical Keyboard Component
 * Provides a virtual keyboard with mathematical symbols and operators
 * Supports insertion into a target textarea element
 */
const MathKeyboard = ({ targetRef, onInsert }) => {
  const [activeCategory, setActiveCategory] = useState('basic');

  /**
   * Symbol categories with their respective symbols
   */
  const symbolCategories = {
    basic: {
      name: 'Basic',
      symbols: [
        '+', '-', '×', '÷', '=', '≠', '<', '>', '≤', '≥',
        '±', '∓', '∞', '°', '%', '‰', '∝', '∴', '∵', '∘'
      ]
    },
    powers: {
      name: 'Powers & Roots',
      symbols: [
        '^', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁰',
        '√', '∛', '∜', '₀', '₁', '₂', '₃', '₄', '₅', '₆'
      ]
    },
    fractions: {
      name: 'Fractions',
      symbols: [
        '½', '⅓', '⅔', '¼', '¾', '⅕', '⅖', '⅗', '⅘', '⅙',
        '⅚', '⅛', '⅜', '⅝', '⅞', '⅐', '⅑', '⅒', '⅟', '/'
      ]
    },
    trigonometry: {
      name: 'Trigonometry',
      symbols: [
        'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
        'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'cot⁻¹', 'sec⁻¹', 'csc⁻¹',
        'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch'
      ]
    },
    calculus: {
      name: 'Calculus',
      symbols: [
        '∫', '∬', '∭', '∮', '∂', '∇', 'd', 'Δ', '∆', 'δ',
        'lim', '→', '∞', '∑', '∏', '!', '‖', '∥', '⊥', '∠'
      ]
    },
    sets: {
      name: 'Sets & Logic',
      symbols: [
        '∈', '∉', '⊆', '⊇', '⊂', '⊃', '∪', '∩', '∅', '∀',
        '∃', '∄', '∧', '∨', '¬', '⊕', '⊗', '⊙', '⊚', '⊛'
      ]
    },
    greek: {
      name: 'Greek Letters',
      symbols: [
        'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ',
        'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ',
        'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ'
      ]
    },
    brackets: {
      name: 'Brackets',
      symbols: [
        '(', ')', '[', ']', '{', '}', '⟨', '⟩', '⌊', '⌋',
        '⌈', '⌉', '|', '‖', '⦃', '⦄', '⦅', '⦆', '⦇', '⦈'
      ]
    }
  };

  /**
   * Expression templates for common mathematical structures
   */
  const templates = {
    fraction: 'a/b',
    integral: '∫f(x)dx',
    definiteIntegral: '∫[a,b]f(x)dx',
    limit: 'lim(x→a)',
    summation: '∑[i=1,n]',
    matrix2x2: '[a b; c d]',
    matrix3x3: '[a b c; d e f; g h i]',
    systemOfEquations: '{eq1; eq2; eq3}',
    derivative: 'd/dx[f(x)]',
    partialDerivative: '∂/∂x[f(x,y)]'
  };

  /**
   * Insert symbol or template into the target textarea
   */
  const insertSymbol = (symbol) => {
    if (onInsert) {
      onInsert(symbol);
    } else if (targetRef && targetRef.current) {
      const textarea = targetRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      const newText = text.substring(0, start) + symbol + text.substring(end);
      textarea.value = newText;
      
      // Update cursor position
      const newCursorPos = start + symbol.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Mathematical Keyboard</h3>
        
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {Object.entries(symbolCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeCategory === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Symbol grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4">
          {symbolCategories[activeCategory].symbols.map((symbol, index) => (
            <button
              key={index}
              onClick={() => insertSymbol(symbol)}
              className="p-2 text-center bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded transition-colors font-mono text-lg text-gray-800 hover:text-blue-800"
              title={`Insert ${symbol}`}
            >
              {symbol}
            </button>
          ))}
        </div>

        {/* Templates section */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Common Templates:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(templates).map(([name, template]) => (
              <button
                key={name}
                onClick={() => insertSymbol(template)}
                className="px-3 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded transition-colors"
                title={`Insert ${template}`}
              >
                {name.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathKeyboard;

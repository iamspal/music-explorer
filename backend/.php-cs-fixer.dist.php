<?php

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/src', __DIR__ . '/public'])
    ->name('*.php')
    ->notPath('vendor');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        '@PSR12:risky' => false,

        // Strict types
        'declare_strict_types' => false,

        // Arrays
        'array_syntax' => ['syntax' => 'short'],

        // Spacing
        'blank_line_before_statement' => [
            'statements' => ['break', 'continue', 'declare', 'return', 'throw', 'try'],
        ],
        'method_chaining_indentation' => true,
        'no_extra_blank_lines' => [
            'tokens' => ['extra', 'throw', 'use', 'use_trait', 'curly_brace_block', 'parenthesis_brace_block', 'square_brace_block'],
        ],
        'single_blank_line_at_eof' => true,
        'no_whitespace_in_blank_line' => true,
        'trim_array_spaces' => true,

        // Types and casting
        'cast_spaces' => ['space' => 'none'],
        'modernize_types_casting' => true,
        'no_unset_cast' => true,

        // Operators and punctuation
        'binary_operator_spaces' => [
            'default' => 'single_space',
        ],
        'concat_space' => ['spacing' => 'one'],
        'unary_operator_spaces' => true,
        'single_quote' => true,
        'trailing_comma_in_multiline' => [
            'elements' => ['arguments', 'arrays', 'match', 'parameters'],
        ],

        // Imports
        'no_unused_imports' => true,
        'ordered_imports' => ['sort_algorithm' => 'alpha', 'imports_order' => ['class', 'function', 'const']],

        // Control structure
        'no_superfluous_elseif' => true,
        'no_useless_else' => true,
        'simplified_if_return' => true,
        'yoda_style' => false,

        // Naming
        'no_homoglyph_names' => true,

        // Comments
        'single_line_comment_style' => ['comment_types' => ['hash']],
        'no_trailing_whitespace_in_comment' => true,

        // Whitespace
        'blank_line_after_opening_tag' => false,
        'compact_nullable_typehint' => true,
    ])
    ->setRiskyAllowed(true)
    ->setFinder($finder)
    ->setCacheFile(__DIR__ . '/.php-cs-fixer.cache');
